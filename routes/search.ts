import { PrismaClient } from "@prisma/client";
import { FastifyPluginOptions } from "fastify";
import { FastifyJsonSchema } from "../types";

const prisma = new PrismaClient();

const queryStringSchema = {
  type: "object",
  properties: {
    q: {
      type: "string",
    },
  },
} as const;
/**
 * Encapsulates the search route
 */
export async function searchRoute(
  app: FastifyJsonSchema,
  options: FastifyPluginOptions
) {
  app.get(
    "/search",
    {
      schema: {
        querystring: queryStringSchema,
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
