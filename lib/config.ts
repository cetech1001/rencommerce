import { z } from "zod";

/**
 * Server-only configuration
 * Only use this in server components, server actions, and API routes
 * DO NOT import this in client components
 */

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production"])
    .default("development"),

  DB_HOST: z.string().min(1, "DB_HOST is required"),
  DB_PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)),
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PASS: z.string().min(1, "DB_PASS is required"),
  DB_NAME: z.string().min(1, "DB_NAME is required"),

  APP_NAME: z.string(),

  PORT: z
    .string()
    .optional()
    .default("3000")
    .transform(Number)
    .pipe(z.number().min(1).max(65535)),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

function validateEnv() {
  // Only validate on server
  if (typeof window !== "undefined") {
    throw new Error("config.ts cannot be imported in client components");
  }

  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      console.error("❌ Invalid environment variables:\n", errorMessages);
      throw new Error("Environment validation failed");
    }
    throw error;
  }
}

export const env = validateEnv();

export const config = {
  nodeEnv: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
  database: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    name: env.DB_NAME,
    url: `mysql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  },
  app: {
    port: env.PORT,
    name: env.APP_NAME,
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    sessionCookieName: "session",
  },
} as const;

export type Config = typeof config;
export type Env = z.infer<typeof envSchema>;
