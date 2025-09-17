import { z } from "zod";

export const HighlightSchema = z.object({
  id: z.number(),
  cover_image_url: z.string().url(),
  title: z.string(),
});

export type Highlight = z.infer<typeof HighlightSchema>;