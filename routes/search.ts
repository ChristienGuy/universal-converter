import { PrismaClient } from "@prisma/client";
import { FastifyPluginOptions } from "fastify";
import { FastifyTypeboxSchema } from "../types";
import { Type } from "@sinclair/typebox";

const prisma = new PrismaClient();

export async function searchRoute(
  app: FastifyTypeboxSchema,
  options: FastifyPluginOptions
) {
  app.get(
    "/search",
    {
      schema: {
        querystring: Type.Object({
          q: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { q } = request.query;
      const objects = await prisma.object.findMany({
        where: {
          name: {
            search: q,
          },
        },
      });

      return objects;
    }
  );
}
