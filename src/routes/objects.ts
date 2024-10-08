import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyTypeboxSchema } from "../types";
import { Type } from "@sinclair/typebox";
import { adminPreHandler } from "../plugins/adminPreHandler";

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

      const responseBody = objects.map((object) => ({
        ...object,
        volume: object.volume.toString(),
      }));

      try {
        await prisma.aPIUsageLog.create({
          data: {
            endpoint: "/objects",
            method: "GET",
            requestBody: JSON.stringify(request.body),
            requestParams: JSON.stringify(request.params),
            requestQuery: JSON.stringify(request.query),
            responseBody: JSON.stringify(responseBody),
          },
        });
      } catch (error) {
        console.error("Failed to create usage log", error);
      }

      return reply.code(200).send(responseBody);
    }
  );

  app.post(
    "/objects",
    {
      preHandler: adminPreHandler,
      schema: {
        hide: true,
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

      const responseBody = {
        ...object,
        volume: object.volume.toString(),
      };

      try {
        await prisma.aPIUsageLog.create({
          data: {
            endpoint: "/objects",
            method: "POST",
            requestBody: JSON.stringify(request.body),
            requestParams: JSON.stringify(request.params),
            requestQuery: JSON.stringify(request.query),
            responseBody: JSON.stringify(responseBody),
          },
        });
      } catch (error) {
        // If storing usage fails we don't want to fail the request
        // It's our problem, not the user's
        console.error("Error in logging", error);
      }

      return reply.code(201).send(responseBody);
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

      const responseBody = {
        ...object,
        volume: object.volume.toString(),
      };

      try {
        await prisma.aPIUsageLog.create({
          data: {
            endpoint: "/objects/{id}",
            method: "GET",
            requestBody: JSON.stringify(request.body),
            requestParams: JSON.stringify(request.params),
            requestQuery: JSON.stringify(request.query),
            responseBody: JSON.stringify(responseBody),
          },
        });
      } catch (error) {
        // If storing usage fails we don't want to fail the request
        // It's our problem, not the user's
        console.error("Error in logging", error);
      }

      reply.code(200).send(responseBody);
    }
  );

  app.patch(
    `/objects/:id`,
    {
      preHandler: adminPreHandler,
      schema: {
        hide: true,
        params: Type.Object({
          id: Type.String(),
        }),
        body: Type.Object({
          name: Type.String(),
          volume: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const updatedObject = await prisma.object.update({
          data: request.body,
          where: {
            id: request.params.id,
          },
        });

        const responseBody = updatedObject;

        try {
          await prisma.aPIUsageLog.create({
            data: {
              endpoint: "/objects/{id}",
              method: "PATCH",
              requestBody: JSON.stringify(request.body),
              requestParams: JSON.stringify(request.params),
              requestQuery: JSON.stringify(request.query),
              responseBody: JSON.stringify(responseBody),
            },
          });
        } catch (error) {
          // If storing usage fails we don't want to fail the request
          // It's our problem, not the user's
          console.error("Error in logging", error);
        }

        return reply.code(200).send(responseBody);
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
  app.delete(
    `/objects/:id`,
    {
      preHandler: adminPreHandler,
      schema: {
        hide: true,
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

        try {
          await prisma.aPIUsageLog.create({
            data: {
              endpoint: "/objects/{id}",
              method: "DELETE",
              requestBody: JSON.stringify(request.body),
              requestParams: JSON.stringify(request.params),
              requestQuery: JSON.stringify(request.query),
            },
          });
        } catch (error) {
          // If storing usage fails we don't want to fail the request
          // It's our problem, not the user's
          console.error("Error in logging", error);
        }

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
