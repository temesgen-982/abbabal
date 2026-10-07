import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export interface Interpretation {
  id: number;
  proverbId: number;
  type: "translation" | "meaning";
  language: "en" | "am";
  content: string;
  source: "telegram" | "ai" | "user";
  isApproved: boolean;
}

export interface ProverbStats {
  views: number;
  forwards: number;
}

export interface Proverb {
  id: number;
  text: string;
  source: "telegram" | "user" | "admin_import";
  status: "pending" | "approved" | "rejected";
  date: string;
  createdAt: string;
  interpretations: Interpretation[];
  latestStats: ProverbStats | null;
}

type LoadReturn = { proverb: Proverb; baseUrl: string };

export const load: PageLoad = async ({ fetch, params }): Promise<LoadReturn> => {
  const base = (PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
  const id = params.id;

  if (!id || isNaN(Number(id))) {
    error(404, "Proverb not found");
  }

  try {
    const response = await fetch(`${base}/proverbs/${id}`, {
      headers: { accept: "application/json" },
    });

    if (response.status === 404) {
      error(404, "Proverb not found");
    }

    if (!response.ok) {
      error(500, "The archive is temporarily unavailable. Please try again shortly.");
    }

    const proverb = (await response.json()) as Proverb | null;
    if (!proverb) {
      error(404, "Proverb not found");
    }
    return { proverb, baseUrl: base };
  } catch (e) {
    if (e && typeof e === "object" && "status" in e) throw e;
    error(500, "Couldn't reach the archive. Check your connection and try again.");
  }
};
