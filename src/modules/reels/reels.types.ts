import { z } from "zod";

// The Zod schema for a Reel from the database
const reelSchema = z.object({
  id: z.number(),
  video_url: z.string().url(),
  caption: z.string().nullable(),
});

type Reel = z.infer<typeof reelSchema>;

export { reelSchema };
export type { Reel };