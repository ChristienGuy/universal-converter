import { PrismaClient } from "@prisma/client";
import { Type } from "@sinclair/typebox";
import { FastifyTypeboxSchema } from "../types";
import { adminPreHandler } from "../plugins/adminPreHandler";

const prisma = new PrismaClient();

export default async function usage(app: FastifyTypeboxSchema) {
  app.get(
    "/usage",
    {
      preHandler: adminPreHandler,
      schema: {
        hide: true,
        response: {
          200: Type.Array(
            Type.Object({
              createdAt: Type.String(),
              endpoint: Type.String(),
              method: Type.String(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const usageLogs = await prisma.aPIUsageLog.findMany();

      return reply.code(200).send(
        usageLogs.map((usageLog) => {
          return {
            createdAt: usageLog.createdAt.toISOString(),
            endpoint: usageLog.endpoint,
            method: usageLog.method,
          };
        })
      );
    }
  );
}
