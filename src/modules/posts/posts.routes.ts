import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { postsService } from "./posts.service";
import { z } from "zod"; // Import Zod for validation

// Define a Zod schema for the expected form fields
const createPostSchema = z.object({
  caption: z.string().min(1, "Caption cannot be empty.").optional(),
});

const postsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = postsService(fastify);

  // POST route to handle image uploads
  fastify.post("/posts", async (request, reply) => {
    // Ensure the request is multipart
    if (!request.isMultipart()) {
      reply.code(415).send({ message: "Request must be multipart" });
      return;
    }

    const parts = request.parts(); // Get the multipart parts

    let caption: string | undefined;
    let imageFile: { buffer: Buffer; filename: string } | undefined;

    for await (const part of parts) {
      if (part.type === "field") {
        if (part.fieldname === "caption") {
          caption = part.value as string;
        }
      } else if (part.type === "file") {
        const buffers: Buffer[] = [];
        for await (const chunk of part.file) {
          buffers.push(chunk);
        }
        imageFile = {
          buffer: Buffer.concat(buffers),
          filename: part.filename,
        };
      }
    }

    if (!imageFile && !caption) {
      return reply
        .code(400)
        .send({ message: "Either image or caption is required." });
    }

    try {
      if (caption) {
        createPostSchema.pick({ caption: true }).parse({ caption });
      }

      const newPost = await service.create({
        caption: caption || "",
        imageFile: imageFile,
      });

      return reply.code(201).send(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply
          .code(400)
          .send({ message: "Validation failed", errors: error.errors });
      }
      fastify.log.error(error);
      return reply.code(500).send({ message: "Failed to create post" });
    }
  });

  // GET route to get all posts
  fastify.get("/posts", async (request, reply) => {
    const posts = service.getAll();
    return posts;
  });
};

export { postsRoutes };