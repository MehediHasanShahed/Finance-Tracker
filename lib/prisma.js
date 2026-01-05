import { PrismaClient } from "@prisma/client";

// Debug log to check env availability in serverless context
console.log("PRISMA INIT - DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("PRISMA INIT - DIRECT_URL exists:", !!process.env.DIRECT_URL);

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.