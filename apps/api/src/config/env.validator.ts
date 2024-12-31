import { z } from 'zod';

// Schema de validación para variables de entorno
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_PORT: z.string().or(z.number()).transform(Number),

  // Backend
  PORT: z.string().or(z.number()).transform(Number),
  API_PREFIX: z.string().startsWith('/'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_SECRET: z.string().min(32),
  NEXT_PUBLIC_JWT_SECRET: z.string().min(32),
  RATE_LIMIT_WINDOW: z.string().or(z.number()).transform(Number).optional().default('15'),
  RATE_LIMIT_MAX: z.string().or(z.number()).transform(Number).optional().default('100'),
  CORS_ORIGIN: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),
  REDIS_PORT: z.string().or(z.number()).transform(Number),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional().default('info'),
  LOG_FORMAT: z.enum(['simple', 'json']).optional().default('json'),

  // Security
  SSL_ENABLED: z.string().or(z.boolean()).transform((val) => val === 'true' || val === true).optional().default(false),
  JWT_EXPIRATION: z.string().or(z.number()).transform(Number).optional().default('24'),
  MAX_LOGIN_ATTEMPTS: z.string().or(z.number()).transform(Number).optional().default('5'),
  SECURE_COOKIES: z.string().or(z.boolean()).transform((val) => val === 'true' || val === true).optional().default(false),
  SESSION_SECRET: z.string().min(32).optional(),
  ENABLE_RATE_LIMIT: z.string().or(z.boolean()).transform((val) => val === 'true' || val === true).optional().default(false),
  ENABLE_HELMET: z.string().or(z.boolean()).transform((val) => val === 'true' || val === true).optional().default(true),
});

// Función para validar variables de entorno
export function validateEnv() {
  try {
    console.log('Variables de entorno cargadas:', {
      SESSION_SECRET: process.env.SESSION_SECRET,
      JWT_SECRET: process.env.JWT_SECRET,
      NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
      CORS_ORIGIN: process.env.CORS_ORIGIN
    });
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Error de validación de variables de entorno:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

// Tipo inferido de las variables de entorno validadas
export type ValidatedEnv = z.infer<typeof envSchema>;

// Exportar una instancia validada de las variables de entorno
export const env = validateEnv();
