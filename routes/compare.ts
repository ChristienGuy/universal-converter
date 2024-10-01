import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { FastifyJsonSchema } from "../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Object = {
  id: string;
  name: string;
  volume: number;
};

type CompareParams = {
  a: string;
  b: string;
};

type CompareReply = {
  200: {
    a: Object;
    b: Object;
    aInB: string;
    bInA: string;
  };
  404: {
    message: string;
  };
};

export async function compareRoute(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.get<{
    Params: CompareParams;
    Reply: CompareReply;
  }>("/compare/:a/:b", async (request, reply) => {
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
      reply.code(404).send({
        message: "Object not found",
      });
      return;
    }

    const aInB = objectB.volume / objectA.volume;
    const bInA = objectA.volume / objectB.volume;

    reply.code(200).send({
      a: objectA,
      b: objectB,
      aInB: aInB.toString(),
      bInA: bInA.toString(),
    });
  });

  app.get<{
    Reply: CompareReply;
  }>("/compare/random", async (request, reply) => {
    const results =
      await prisma.$queryRaw`SELECT * FROM "Object" ORDER BY RANDOM() LIMIT 2`;
    const [objectA, objectB] = results;

    if (!objectA || !objectB) {
      reply.code(404).send({
        message: "Object not found",
      });
      return;
    }

    const aInB = objectB.volume / objectA.volume;
    const bInA = objectA.volume / objectB.volume;

    reply.code(200).send({
      a: objectA,
      b: objectB,
      aInB: aInB.toString(),
      bInA: bInA.toString(),
    });
  });
}
