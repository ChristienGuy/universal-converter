import { PrismaClient } from "@prisma/client";
import { Type } from "@sinclair/typebox";
import { FastifyTypeboxSchema } from "../types";

import { getRandomObject } from "@prisma/client/sql";

const prisma = new PrismaClient();

export default async function compareRoute(app: FastifyTypeboxSchema) {
  app.get(
    "/compare/:a/:b",
    {
      schema: {
        params: Type.Object({
          a: Type.String(),
          b: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { a, b } = request.params;

      const objectA = await prisma.object.findUnique({
        where: {
          id: a,
        },
      });

      const objectB = await prisma.object.findUnique({
        where: {
          id: b,
        },
      });

      if (!objectA || !objectB) {
        reply.notFound();
        return;
      }

      const aInB = Number(objectB.volume) / Number(objectA.volume);
      const bInA = Number(objectA.volume) / Number(objectB.volume);

      reply.code(200).send({
        a: objectA,
        b: objectB,
        aInB: aInB.toString(),
        bInA: bInA.toString(),
      });
    }
  );

  app.get("/compare/random", async (request, reply) => {
    const results = await prisma.$queryRawTyped(getRandomObject());

    const [objectA, objectB] = results;

    if (!objectA || !objectB) {
      reply.code(404).send({
        message: "Object not found",
      });
      return;
    }

    const aInB = Number(objectB.volume) / Number(objectA.volume);
    const bInA = Number(objectA.volume) / Number(objectB.volume);

    reply.code(200).send({
      a: objectA,
      b: objectB,
      aInB: aInB.toString(),
      bInA: bInA.toString(),
    });
  });
}
