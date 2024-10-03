import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyTypeboxSchema } from "../types";
import { Type } from "@sinclair/typebox";

const prisma = new PrismaClient();

export default async function objects(app: FastifyTypeboxSchema) {
  app.get(
    "/objects",
    {
      schema: {
        tags: ["Objects"],
        description: "Get all objects",
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
      const objects = await prisma.object.findMany();

      reply.code(200).send(
        objects.map((object) => ({
          ...object,
          volume: object.volume.toString(),
        }))
      );
    }
  );

  app.post(
    "/objects",
    {
      schema: {
        tags: ["Objects"],
        description: "Create an object",
        body: Type.Object({
          name: Type.String({
            description: "The name of the object",
          }),
          volume: Type.Number({
            description: "The volume of the object",
          }),
        }),
        response: {
          201: Type.Object({
            id: Type.String(),
            name: Type.String(),
            volume: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const object = await prisma.object.create({
        data: request.body,
      });

      reply.code(201).send({
        ...object,
        volume: object.volume.toString(),
      });
    }
  );

  app.get(
    `/objects/:id`,
    {
      schema: {
        tags: ["Objects"],
        description: "Get an object by ID",
        params: Type.Object({
          id: Type.String({
            description: "The ID of the object",
          }),
        }),
        response: {
          200: Type.Object({
            id: Type.String(),
            name: Type.String(),
            volume: Type.String(),
          }),
          404: Type.Object({
            message: Type.String({
              default: "Object not found",
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const object = await prisma.object.findUnique({
        where: {
          id: request.params.id,
        },
      });

      if (!object) {
        reply.notFound(`Object with ID ${request.params.id} not found`);
        return;
      }

      reply.code(200).send({
        ...object,
        volume: object.volume.toString(),
      });
    }
  );

  app.delete(
    `/objects/:id`,
    {
      schema: {
        params: Type.Object({
          id: Type.String({
            description: "The ID of the object",
          }),
        }),
      },
    },
    async (request, reply) => {
      try {
        await prisma.object.delete({
          where: {
            id: request.params.id,
          },
        });

        return reply.code(204).send();
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            return reply.notFound(
              `Object with ID ${request.params.id} does not exist`
            );
          }
        }

        return reply.code(500).send();
      }
    }
  );
}
