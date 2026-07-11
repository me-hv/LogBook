import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Fallback placeholder prevents instantiation errors during build time if environment variables are not present.
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/placeholder_db";

let prismaInstance: PrismaClient;

if (typeof window === "undefined") {
  const pool = new Pool({
    connectionString: databaseUrl,
  });
  const adapter = new PrismaPg(pool);

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
} else {
  // Safe client-side fallback
  prismaInstance = {} as unknown as PrismaClient;
}

export const prisma = prismaInstance;
