import { PrismaClient } from "@prisma/client";
import { FastifyTypeboxSchema } from "../types";

const prisma = new PrismaClient();

export async function objects(app: FastifyTypeboxSchema) {
  app.get("/objects", async (request, reply) => {
    const objects = await prisma.object.findMany();

    return objects;
  });
}
