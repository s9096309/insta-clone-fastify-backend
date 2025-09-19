import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { taggedService } from "./tagged.service";

const taggedRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = taggedService(fastify);

  fastify.get("/tagged/grid", async (request, reply) => {
    // Update the method call here
    const tagged = await service.getAll();
    return tagged;
  });
};

export { taggedRoutes };