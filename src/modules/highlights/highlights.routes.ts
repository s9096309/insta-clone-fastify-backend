import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { highlightsService } from "./highlights.service";

const highlightsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = highlightsService(fastify);

  // Route 1: Get the list of all highlights
  fastify.get("/highlights", async (request, reply) => {
    const highlights = await service.getAll();
    return highlights;
  });

  // Route 2: Get a single highlight by its ID
  fastify.get<{ Params: { id: string } }>("/highlights/:id", async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const highlight = await service.getById(id);
    return highlight;
  });
};

export { highlightsRoutes };