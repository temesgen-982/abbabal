import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { Interpretation, PaginatedProverbs, Proverb } from './api';

const DB_NAME = 'proverbs';
const LAST_SYNC_KEY = 'abbabal.lastSyncAt';
export const DATABASE_SYNC_EVENT = 'abbabal:database-sync';

// How many proverbs to request/upsert per round trip during a sync.
const SYNC_BATCH_SIZE = 50;

type ProverbRow = {
  id: number;
  text: string;
  date: string;
  views: number | null;
  forwards: number | null;
  source: string | null;
  scrapedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type InterpretationRow = {
  id: number;
  proverbId: number;
  type: 'translation' | 'meaning';
  language: 'en' | 'am';
  content: string;
  model: string | null;
  confidence: number | null;
  needsReview: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

// Shapes returned by the API when syncing.
type ServerInterpretation = InterpretationRow;
type ServerProverb = {
  id: number;
  text: string;
  date: string;
  views: number | null;
  forwards: number | null;
  source: string | null;
  scrapedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  interpretations?: ServerInterpretation[];
};

const PROVERB_COLUMNS =
  'id, text, date, views, forwards, source, scraped_at as scrapedAt, created_at as createdAt, updated_at as updatedAt';

const INTERPRETATION_COLUMNS =
  'id, proverb_id as proverbId, type, language, content, model, confidence, needs_review as needsReview, created_at as createdAt, updated_at as updatedAt';

let sqlite: SQLiteConnection | null = null;
let conn: SQLiteDBConnection | null = null;
let ready: Promise<SQLiteDBConnection | null> | null = null;

function getSqlite() {
  if (!sqlite) sqlite = new SQLiteConnection(CapacitorSQLite);
  return sqlite;
}

export function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

function mapInterpretation(row: InterpretationRow): Interpretation {
  return {
    id: row.id,
    proverbId: row.proverbId,
    type: row.type,
    language: row.language,
    content: row.content,
    source: row.model ? 'ai' : 'telegram',
    confidence: row.confidence ?? null,
    isApproved: row.needsReview === 0,
    createdAt: row.createdAt ?? '',
  };
}

function mapProverb(row: ProverbRow, interpretations: Interpretation[] = []): Proverb {
  return {
    id: row.id,
    text: row.text,
    date: row.date,
    createdAt: row.createdAt ?? '',
    interpretations,
  };
}

function getConnection(): Promise<SQLiteDBConnection | null> {
  if (!isNativePlatform()) return Promise.resolve(null);
  if (conn) return Promise.resolve(conn);
  if (!ready) {
    ready = (async () => {
      try {
        const connection = getSqlite();
        const { result: exists } = await CapacitorSQLite.isDatabase({ database: DB_NAME });
        if (!exists) {
          await CapacitorSQLite.copyFromAssets({ overwrite: false });
        }
        conn = await connection.createConnection(DB_NAME, false, 'no-encryption', 1, false);
        await conn.open();
        return conn;
      } catch (e) {
        console.error('[db] init failed', e);
        ready = null;
        conn = null;
        return null;
      }
    })();
  }
  return ready;
}

async function query<T>(statement: string, values: unknown[] = []): Promise<T[]> {
  const connection = await getConnection();
  if (!connection) throw new Error('Local database unavailable');
  const res = await connection.query(statement, values);
  return (res.values ?? []) as T[];
}

async function interpretationsFor(proverbIds: number[]): Promise<Map<number, Interpretation[]>> {
  if (proverbIds.length === 0) return new Map();
  const placeholders = proverbIds.map(() => '?').join(',');
  const rows = await query<InterpretationRow>(
    `SELECT ${INTERPRETATION_COLUMNS} FROM interpretations WHERE proverb_id IN (${placeholders}) ORDER BY id`,
    proverbIds,
  );
  const map = new Map<number, Interpretation[]>();
  for (const row of rows) {
    const list = map.get(row.proverbId) ?? [];
    list.push(mapInterpretation(row));
    map.set(row.proverbId, list);
  }
  return map;
}

export const localDb = {
  async isReady(): Promise<boolean> {
    return (await getConnection()) !== null;
  },

  async list(page = 1, limit = 20): Promise<PaginatedProverbs> {
    const skip = (page - 1) * limit;
    const rows = await query<ProverbRow>(
      `SELECT ${PROVERB_COLUMNS} FROM proverbs ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, skip],
    );
    const [totalRow] = await query<{ total: number }>('SELECT COUNT(*) as total FROM proverbs');
    const total = Number(totalRow?.total ?? 0);
    const interps = await interpretationsFor(rows.map((r) => r.id));
    return {
      page,
      limit,
      total,
      results: rows.map((r) => mapProverb(r, interps.get(r.id) ?? [])),
    };
  },

  async findOne(id: number): Promise<Proverb | null> {
    const [row] = await query<ProverbRow>(
      `SELECT ${PROVERB_COLUMNS} FROM proverbs WHERE id = ?`,
      [id],
    );
    if (!row) return null;
    const interps = await interpretationsFor([id]);
    return mapProverb(row, interps.get(id) ?? []);
  },

  async random(): Promise<Proverb | null> {
    const [row] = await query<ProverbRow>(
      `SELECT ${PROVERB_COLUMNS} FROM proverbs ORDER BY RANDOM() LIMIT 1`,
    );
    if (!row) return null;
    const interps = await interpretationsFor([row.id]);
    return mapProverb(row, interps.get(row.id) ?? []);
  },

  async search(q: string, limit = 20): Promise<Proverb[]> {
    if (!q.trim()) return [];
    const like = `%${q}%`;
    const rows = await query<ProverbRow>(
      `SELECT DISTINCT p.id, p.text, p.date, p.views, p.forwards, p.source, p.scraped_at as scrapedAt, p.created_at as createdAt, p.updated_at as updatedAt
       FROM proverbs p
       LEFT JOIN interpretations i ON i.proverb_id = p.id
       WHERE p.text LIKE ? OR i.content LIKE ?
       ORDER BY p.id DESC
       LIMIT ?`,
      [like, like, limit],
    );
    const interps = await interpretationsFor(rows.map((r) => r.id));
    return rows.map((r) => mapProverb(r, interps.get(r.id) ?? []));
  },
};

const UPSERT_PROVERB_SQL =
  'INSERT OR REPLACE INTO proverbs (id, text, date, views, forwards, source, scraped_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
const DELETE_PROVERB_INTERPS_SQL =
  'DELETE FROM interpretations WHERE proverb_id = ?';
const INSERT_INTERPRETATION_SQL =
  'INSERT OR REPLACE INTO interpretations (id, proverb_id, type, language, content, model, confidence, needs_review, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

async function fetchJson<T>(url: string): Promise<T> {
  // The manifest is cacheable server-side, but we always want a fresh view
  // when deciding what changed.
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return (await res.json()) as T;
}

async function writeProverbs(
  connection: SQLiteDBConnection,
  proverbs: ServerProverb[],
): Promise<void> {
  if (!proverbs.length) return;
  const set: { statement: string; values: unknown[] }[] = [];
  for (const proverb of proverbs) {
    set.push({
      statement: UPSERT_PROVERB_SQL,
      values: [
        proverb.id,
        proverb.text,
        proverb.date,
        proverb.views ?? 0,
        proverb.forwards ?? 0,
        proverb.source ?? 'telegram',
        proverb.scrapedAt ?? null,
        proverb.createdAt ?? null,
        proverb.updatedAt ?? null,
      ],
    });
    set.push({ statement: DELETE_PROVERB_INTERPS_SQL, values: [proverb.id] });
    for (const interp of proverb.interpretations ?? []) {
      set.push({
        statement: INSERT_INTERPRETATION_SQL,
        values: [
          interp.id,
          proverb.id,
          interp.type,
          interp.language,
          interp.content,
          interp.model ?? null,
          interp.confidence ?? null,
          interp.needsReview ?? 0,
          interp.createdAt ?? null,
          interp.updatedAt ?? null,
        ],
      });
    }
  }
  await connection.executeSet(set, true);
}

async function deleteProverbs(
  connection: SQLiteDBConnection,
  ids: number[],
): Promise<void> {
  if (!ids.length) return;
  const set: { statement: string; values: unknown[] }[] = [];
  for (const id of ids) {
    set.push({ statement: DELETE_PROVERB_INTERPS_SQL, values: [id] });
    set.push({ statement: 'DELETE FROM proverbs WHERE id = ?', values: [id] });
  }
  await connection.executeSet(set, true);
}

/**
 * Incremental sync.
 *
 * The local database ships with the app, so we only need to pull proverbs that
 * were added or changed since the bundled snapshot — plus drop any that were
 * removed. This avoids downloading the whole `.db` over the network, which the
 * Android SQLite plugin does on Capacitor's single plugin thread and therefore
 * blocks every other query while it runs.
 */
export async function syncDatabase(baseUrl: string): Promise<boolean> {
  if (!isNativePlatform()) return false;
  const connection = await getConnection();
  if (!connection) return false;

  try {
    const base = baseUrl.replace(/\/+$/, '');

    // 1. Server manifest: every proverb id and its last-modified time.
    const manifest = await fetchJson<{
      total?: number;
      ids: { id: number; updatedAt: string | null }[];
    }>(`${base}/proverbs/ids`);
    const server = manifest.ids ?? [];

    // Never treat an empty/partial manifest as "everything was deleted".
    if (!server.length) throw new Error('empty manifest');

    // 2. Local manifest.
    const localRows = await query<{ id: number; updatedAt: string | null }>(
      'SELECT id, updated_at as updatedAt FROM proverbs',
    );
    const localUpdated = new Map(
      localRows.map((row) => [row.id, row.updatedAt ?? null]),
    );

    // 3. Everything new or whose last-modified time differs.
    const serverIds = new Set<number>();
    const changedIds: number[] = [];
    for (const entry of server) {
      serverIds.add(entry.id);
      const local = localUpdated.get(entry.id);
      if (local === undefined || local !== (entry.updatedAt ?? null)) {
        changedIds.push(entry.id);
      }
    }

    // 4. Proverbs removed on the server.
    const removedIds = localRows
      .map((row) => row.id)
      .filter((id) => !serverIds.has(id));

    // 5. Fetch and upsert only what changed.
    for (let i = 0; i < changedIds.length; i += SYNC_BATCH_SIZE) {
      const chunk = changedIds.slice(i, i + SYNC_BATCH_SIZE);
      const batch = await fetchJson<{ results: ServerProverb[] }>(
        `${base}/proverbs/batch?ids=${chunk.join(',')}`,
      );
      await writeProverbs(connection, batch.results ?? []);
    }

    if (removedIds.length) {
      await deleteProverbs(connection, removedIds);
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(DATABASE_SYNC_EVENT));
    }
    return true;
  } catch (e) {
    console.error('[db] sync failed', e);
    return false;
  }
}

export function getLastSyncAt(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(LAST_SYNC_KEY);
}
