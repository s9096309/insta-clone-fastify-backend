import type { FastifyInstance } from "fastify";
import { CreatePostDto } from "./posts.types";

const postsService = (fastify: FastifyInstance) => {
  return {
    create: async (postData: CreatePostDto) => {
      fastify.log.info(`Creating a new post`);
      const post = await fastify.transactions.posts.create(postData);
      return post;
    },

    // New function to get all posts
    getAll: async () => {
      fastify.log.info(`Getting all posts`);
      const posts = await fastify.transactions.posts.getAll();
      return posts;
    },
  };
};

export { postsService };