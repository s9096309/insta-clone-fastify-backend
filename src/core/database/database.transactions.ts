import type Database from "better-sqlite3";
import type { CreatePostDto, Post } from "../../modules/posts/posts.types";
import { Reel } from "../../modules/reels/reels.types";
import { TaggedPost } from "../../modules/tagged/tagged.types";
import { Highlight } from "../../modules/highlights/highlights.types"; // <-- Corrected path for consistency

export type TransactionHelpers = ReturnType<typeof createTransactionHelpers>;

const createTransactionHelpers = (db: Database.Database) => {
  const statements = {
    getPostById: db.prepare("SELECT * FROM posts WHERE id = ?"),
    getAllPosts: db.prepare("SELECT * FROM posts"),
    createPost: db.prepare(
      "INSERT INTO posts (img_url, caption) VALUES (?, ?)"
    ),
    getReelsForGrid: db.prepare("SELECT id, video_url, caption FROM reels"),
    getTaggedPostsForGrid: db.prepare(`
      SELECT p.id, p.img_url, p.caption, tp.user_who_tagged
      FROM posts p
      JOIN tagged_posts tp ON p.id = tp.post_id
    `),
    // --- Add new statements for highlights below ---
    getAllHighlights: db.prepare("SELECT * FROM highlights"),
    getHighlightById: db.prepare("SELECT * FROM highlights WHERE id = ?"),
  };

  const posts = {
    getById: (id: number) => {
      return statements.getPostById.get(id) as Post;
    },
    getAll: () => {
      return statements.getAllPosts.all() as Post[];
    },
    create: (data: CreatePostDto) => {
      const result = statements.createPost.run(data.img_url, data.caption);
      return statements.getPostById.get(result.lastInsertRowid) as Post;
    },
  };

  const reels = {
    getForGrid: () => {
      return statements.getReelsForGrid.all() as Reel[];
    },
  };

  const tagged = {
    getForGrid: () => {
      return statements.getTaggedPostsForGrid.all() as TaggedPost[];
    },
  };

  

  const highlights = {
    getAll: () => {
      return statements.getAllHighlights.all() as Highlight[];
    },
    getById: (id: number) => {
      return statements.getHighlightById.get(id) as Highlight;
    },
  };

  return {
    posts,
    reels,
    tagged,
    highlights,
  };
};

export { createTransactionHelpers };