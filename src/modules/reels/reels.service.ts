import type { FastifyInstance } from "fastify";

const reelsService = (fastify: FastifyInstance) => {
  return {
    getForGrid: async () => {
      fastify.log.info("Getting all reels for the grid");
      const reels = await fastify.transactions.reels.getForGrid();
      return reels;
    },
  };
};

export { reelsService };