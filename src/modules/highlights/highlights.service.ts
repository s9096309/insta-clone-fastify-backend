import type { FastifyInstance } from "fastify";

const highlightsService = (fastify: FastifyInstance) => {
  return {
    // Method to get the list of all highlights
    getAll: async () => {
      fastify.log.info(`Getting all highlights`);
      const highlights = await fastify.transactions.highlights.getAll();
      return highlights;
    },

    // Method to get a single highlight by its ID
    getById: async (id: number) => {
      fastify.log.info(`Getting highlight by id: ${id}`);
      const highlight = await fastify.transactions.highlights.getById(id);
      return highlight;
    },
  };
};

export { highlightsService };