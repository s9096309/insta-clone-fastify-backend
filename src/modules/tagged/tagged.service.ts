import type { FastifyInstance } from "fastify";

const taggedService = (fastify: FastifyInstance) => {
  return {
    getAll: async () => {
      fastify.log.info("Getting all tagged posts for the grid");
      const tagged = await fastify.transactions.tagged.getAll();
      return tagged;
    },
  };
};

export { taggedService };