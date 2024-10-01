import { PrismaClient } from "@prisma/client";
import { FastifyTypeboxSchema } from "../types";
import { Type } from "@sinclair/typebox";

const prisma = new PrismaClient();

const schema = {
  response: {
    200: Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
        volume: Type.String(),
      })
    ),
    404: Type.Object({
      message: Type.String({
        default: "Not found",
      }),
      code: Type.Integer({
        default: 404,
      }),
    }),
  },
};

export default async function objects(app: FastifyTypeboxSchema) {
  app.get(
    "/objects",
    {
      schema,
    },
    async (request, reply) => {
      const objects = await prisma.object.findMany({
        select: {
          id: true,
          name: true,
          volume: true,
        },
      });

      if (objects.length === 0) {
        reply.notFound();
      }

      reply.code(200).send(
        objects.map((object) => ({
          ...object,
          volume: object.volume.toString(),
        }))
      );
    }
  );
}
