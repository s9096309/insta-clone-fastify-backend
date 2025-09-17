import Fastify from "fastify";
import { databasePlugin } from "./core/database/database.plugin";
import { postsRoutes } from "./modules/posts/posts.routes";
import { reelsRoutes } from "./modules/reels/reels.routes";
import { taggedRoutes } from "./modules/tagged/tagged.routes";
import { highlightsRoutes} from "./modules/highlights/highlights.routes"

const fastify = Fastify({
  logger: true,
});

// Register our database plugin
fastify.register(databasePlugin);
// Register our module routes
fastify.register(postsRoutes);
fastify.register(reelsRoutes);
fastify.register(taggedRoutes)
fastify.register(highlightsRoutes)

// Declare a default route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

const port = 3000;

fastify.listen({ port }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});