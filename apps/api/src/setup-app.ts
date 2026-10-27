import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureApp(app: INestApplication) {
  // The archive is public and read-only, so every origin is allowed. CORS was
  // never access control here: scripts ignore it entirely, and an allowlist
  // only broke legitimate browser clients (including the Capacitor app shell,
  // which loads from `https://localhost` and `capacitor://localhost`).
  // `credentials` stays off because `origin: '*'` and credentials are mutually
  // exclusive per the spec.
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'OPTIONS'],
    exposedHeaders: ['Content-Disposition', 'ETag'],
    maxAge: 86400,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  return app;
}
