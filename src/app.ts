import Fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifyAutoload } from "@fastify/autoload";
import cors from "@fastify/cors";
import { join } from "path";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: "*",
});

fastify.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "Universal Converter",
      description: "API for converting maniacal units",
      version: "0.1.0",
    },
  },
});

fastify.register(fastifyAutoload, {
  dir: join(__dirname, "plugins"),
});

fastify.register(fastifyAutoload, {
  dir: join(__dirname, "routes"),
});

fastify.register(require("@scalar/fastify-api-reference"), {
  routePrefix: "/docs",
  configuration: {
    spec: {
      content: () => fastify.swagger(),
    },
  },
});

fastify.listen(
  { host: "::", port: Number(process.env.PORT) || 4000 },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    console.log(`
      🚀 Server listening at ${address}
    `);
  }
);
