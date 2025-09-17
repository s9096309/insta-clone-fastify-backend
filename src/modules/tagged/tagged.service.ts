import type { FastifyInstance } from "fastify";

const taggedService = (fastify: FastifyInstance) => {
  return {
    getForGrid: async () => {
      fastify.log.info("Getting all tagged posts for the grid");
      const tagged = await fastify.transactions.tagged.getForGrid();
      return tagged;
    },
  };
};

export { taggedService };