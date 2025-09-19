import Fastify from "fastify";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static"; // <-- New import
import path from "path";
import { databasePlugin } from "./core/database/database.plugin";
import { postsRoutes } from "./modules/posts/posts.routes";
import { reelsRoutes } from "./modules/reels/reels.routes";
import { taggedRoutes } from "./modules/tagged/tagged.routes";
import { highlightsRoutes } from "./modules/highlights/highlights.routes";

const fastify = Fastify({
  logger: true,
});

async function main() {
  // Register static file plugin first
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
    prefix: "/",
  });

  // Register other plugins
  fastify.register(multipart);
  fastify.register(databasePlugin);

  // Then register your routes
  fastify.register(postsRoutes);
  fastify.register(reelsRoutes);
  fastify.register(taggedRoutes);
  fastify.register(highlightsRoutes);

  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();