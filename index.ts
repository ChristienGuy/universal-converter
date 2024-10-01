import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { searchRoute } from "./routes/search";

const prisma = new PrismaClient();

const app = Fastify({
  logger: true,
});

app.register(searchRoute);

app.get("/objects", async (request, reply) => {
  const objects = await prisma.object.findMany();

  return objects;
});

async function start() {
  try {
    await app.listen({
      port: 4000,
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }

  console.log(`
  🚀 Server listening at http://localhost:4000
  `);
}

start();
