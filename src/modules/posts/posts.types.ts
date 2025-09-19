import { z } from "zod";

// Define the schema for creating a post
const createPostDtoSchema = z.object({
  img_url: z.string().url(),
  caption: z.string().nullable().optional(),
});

// Define the schema for a post object from the database
const postSchema = z.object({
  id: z.number(),
  img_url: z.string().url(),
  caption: z.string().nullable(),
  created_at: z.string(),
});

// Define and export the schema for an array of posts
export const postsSchema = z.array(postSchema);

// Infer and export the TypeScript types
export type CreatePostDto = z.infer<typeof createPostDtoSchema>;
export type Post = z.infer<typeof postSchema>;