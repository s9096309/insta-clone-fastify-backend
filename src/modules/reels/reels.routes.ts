import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { reelsService } from "./reels.service";

const reelsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = reelsService(fastify);

  fastify.get("/reels/grid", async (request, reply) => {
    const reels = await service.getForGrid();
    return reels;
  });
};

export { reelsRoutes };