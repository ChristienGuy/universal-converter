import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import { join } from "path";

const fastify = Fastify({
  logger: true,
});

fastify.register(AutoLoad, {
  dir: join(__dirname, "routes"),
});

fastify.listen(
  { host: "::", port: Number(process.env.PORT) || 4000 },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }
);
