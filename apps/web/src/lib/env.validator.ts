import { z } from 'zod';

// Schema de validación para variables de entorno del frontend
const envSchema = z.object({
  // API y Autenticación
  NEXT_PUBLIC_API_URL: z.string().url().or(z.string().startsWith('/')),
  NEXT_PUBLIC_JWT_SECRET: z.string().min(32),

  // Configuración de Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
  NEXT_TELEMETRY_DISABLED: z.string().optional(),

  // Seguridad (si se necesitan en el frontend)
  JWT_EXPIRATION: z.string().or(z.number()).transform(Number).optional().default('24'),
  SECURE_COOKIES: z.string().or(z.boolean()).transform((val) => val === 'true' || val === true).optional().default(false),
  COOKIE_DOMAIN: z.string().optional(),
});

// Función para validar variables de entorno
export function validateEnv() {
  try {
    const parsed = envSchema.parse({
      ...process.env,
      // Asegurar que las variables públicas estén disponibles
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
    });
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Error de validación de variables de entorno del frontend:');
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
