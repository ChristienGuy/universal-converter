import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

export async function adminPreHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = getAuth(request);

  if (user.orgRole !== "org:admin") {
    return reply.unauthorized();
  }
}
