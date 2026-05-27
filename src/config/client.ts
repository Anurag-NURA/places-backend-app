import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

export async function checkConnection() {
  try {
    // Attempt to query any table or simply test the connection
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Successfully connected to Supabase!");
    console.log("Database Response:", result);
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
