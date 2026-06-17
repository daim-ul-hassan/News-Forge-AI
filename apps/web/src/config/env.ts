import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://127.0.0.1:8000"),
  NEXT_PUBLIC_API_V1_PREFIX: z.string().default("/api/v1"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_V1_PREFIX: process.env.NEXT_PUBLIC_API_V1_PREFIX,
});

export function getApiBaseUrl(): string {
  return env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
}

export function getApiV1Prefix(): string {
  return env.NEXT_PUBLIC_API_V1_PREFIX;
}
