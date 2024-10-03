import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

export async function adminPreHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { orgRole } = getAuth(request);

  if (orgRole !== "admin") {
    return reply.unauthorized();
  }
}
