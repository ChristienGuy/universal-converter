import { PrismaClient } from "@prisma/client";
import { Type } from "@sinclair/typebox";
import { FastifyTypeboxSchema } from "../types";

import { getRandomObject } from "@prisma/client/sql";

const prisma = new PrismaClient();

const ObjectSchema = Type.Object({
  id: Type.String({
    format: "uuid",
  }),
  name: Type.String({
    examples: ["Olympic Swimming Pool", "Baseball", "Honey Bee"],
  }),
  volume: Type.String({
    examples: ["216.56", "0.3", "2500000"],
  }),
});

const ResponseSchema = {
  200: Type.Object({
    a: ObjectSchema,
    b: ObjectSchema,
    aInB: Type.String({
      examples: ["0.0001"],
    }),
    bInA: Type.String({
      examples: ["10000"],
    }),
  }),
};

export default async function compareRoute(app: FastifyTypeboxSchema) {
  app.get(
    "/compare/:a/:b",
    {
      schema: {
        tags: ["Compare"],
        description: "Compare two objects",
        params: Type.Object({
          a: Type.String({
            description: "The ID of the first object",
          }),
          b: Type.String({
            description: "The ID of the second object",
          }),
        }),
        response: {
          ...ResponseSchema,
          404: Type.Object({
            message: Type.String({
              description: "Object not found",
            }),
          }),
        },
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

      if (!objectA) {
        reply.notFound(`Object with ID ${a} not found`);
        return;
      }

      if (!objectB) {
        reply.notFound(`Object with ID ${b} not found`);
        return;
      }

      const aInB = Number(objectB.volume) / Number(objectA.volume);
      const bInA = Number(objectA.volume) / Number(objectB.volume);

      reply.code(200).send({
        a: { ...objectA, volume: objectA.volume.toString() },
        b: { ...objectB, volume: objectB.volume.toString() },
        aInB: aInB.toString(),
        bInA: bInA.toString(),
      });
    }
  );

  app.get(
    "/compare/random",
    {
      schema: {
        tags: ["Compare"],
        description: "Get two random objects and compare them",
        response: ResponseSchema,
      },
    },
    async (request, reply) => {
      const results = await prisma.$queryRawTyped(getRandomObject());

      const [objectA, objectB] = results;

      if (!objectA || !objectB) {
        reply.notFound("Objects not found");
        return;
      }

      const aInB = Number(objectB.volume) / Number(objectA.volume);
      const bInA = Number(objectA.volume) / Number(objectB.volume);

      reply.code(200).send({
        a: { ...objectA, volume: objectA.volume.toString() },
        b: { ...objectB, volume: objectB.volume.toString() },
        aInB: aInB.toString(),
        bInA: bInA.toString(),
      });
    }
  );
}
