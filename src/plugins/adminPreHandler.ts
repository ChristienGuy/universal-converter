import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

export async function adminPreHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { sessionId } = getAuth(request);

  if (!sessionId) {
    return reply.unauthorized();
  }
}
