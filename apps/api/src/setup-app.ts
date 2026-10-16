import { INestApplication, ValidationPipe } from '@nestjs/common';

// Origins the Capacitor app shell can load from. Capacitor serves the web
// bundle from `https://localhost` on Android and `capacitor://localhost` on
// iOS, so these must always be allowed for the mobile app's `fetch` calls.
const APP_SHELL_ORIGINS = [
  'http://localhost',
  'http://localhost:5173',
  'https://localhost',
  'capacitor://localhost',
];

export function configureApp(app: INestApplication) {
  const configuredOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const origins = Array.from(
    new Set([...APP_SHELL_ORIGINS, ...configuredOrigins]),
  );

  app.enableCors({
    origin: origins,
    credentials: true,
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
