import type Database from "better-sqlite3";
import type { CreatePostDto, Post } from "../../modules/posts/posts.types";
import { Reel } from "../../modules/reels/reels.types";
import { TaggedPost } from "../../modules/tagged/tagged.types";
import { Highlight } from "../../modules/highlights/highlights.types";

export type TransactionHelpers = ReturnType<typeof createTransactionHelpers>;

const createTransactionHelpers = (db: Database.Database) => {
  // --- POSTS ---
  // Reverting to the original, stable implementation for 'create'
  const postsStatements = {
    getById: db.prepare("SELECT * FROM posts WHERE id = ?"),
    getAll: db.prepare("SELECT * FROM posts"),
    create: db.prepare(
      "INSERT INTO posts (img_url, caption) VALUES (?, ?)"
    ),
  };
  const posts = {
    getById: (id: number) => postsStatements.getById.get(id) as Post,
    getAll: () => postsStatements.getAll.all() as Post[],
    create: (data: CreatePostDto) => {
      const result = postsStatements.create.run(data.img_url, data.caption);
      return postsStatements.getById.get(result.lastInsertRowid) as Post;
    },
  };

  // --- REELS ---
  const reelsStatements = {
    getAll: db.prepare("SELECT id, video_url, thumbnail_url, caption, views FROM reels"),
  };
  const reels = {
    getAll: () => reelsStatements.getAll.all() as Reel[],
  };

  // --- TAGGED ---
  const taggedStatements = {
    getAll: db.prepare(`
      SELECT p.id, p.img_url, p.caption, tp.user_who_tagged
      FROM posts p
      JOIN tagged_posts tp ON p.id = tp.post_id
    `),
  };
  const tagged = {
    getAll: () => taggedStatements.getAll.all() as TaggedPost[],
  };

  // --- HIGHLIGHTS ---
  const highlightsStatements = {
    getAll: db.prepare("SELECT * FROM highlights"),
    getById: db.prepare("SELECT * FROM highlights WHERE id = ?"),
  };
  const highlights = {
    getAll: () => highlightsStatements.getAll.all() as Highlight[],
    getById: (id: number) => highlightsStatements.getById.get(id) as Highlight,
  };

  return {
    posts,
    reels,
    tagged,
    highlights,
  };
};

export { createTransactionHelpers };