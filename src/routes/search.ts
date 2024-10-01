import { PrismaClient } from "@prisma/client";
import { FastifyTypeboxSchema } from "../types";
import { Type } from "@sinclair/typebox";

const prisma = new PrismaClient();

export default async function searchRoute(app: FastifyTypeboxSchema) {
  app.get(
    "/search",
    {
      schema: {
        tags: ["Search"],
        description:
          "Search for objects by name, only accepts whole word matches",
        querystring: Type.Object({
          q: Type.String(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.String(),
              name: Type.String(),
              volume: Type.String(),
            })
          ),
        },
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

      return objects.map((object) => ({
        ...object,
        volume: object.volume.toString(),
      }));
    }
  );
}
