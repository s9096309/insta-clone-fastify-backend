import type { FastifyInstance } from "fastify";

const reelsService = (fastify: FastifyInstance) => {
  return {
    getAll: async () => {
      fastify.log.info("Getting all reels for the grid");
      const reels = await fastify.transactions.reels.getAll();
      return reels;
    },
  };
};

export { reelsService };