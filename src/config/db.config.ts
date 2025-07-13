import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient({
  log: ["query"],
});

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

main();

export default prisma;
