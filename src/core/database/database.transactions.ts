import type Database from "better-sqlite3";
import type { CreatePostDto, Post } from "../modules/posts/posts.types";
// New import for Reel types
import { ReelForGrid } from "../modules/reels/reels.types";

export type TransactionHelpers = ReturnType<typeof createTransactionHelpers>;

const createTransactionHelpers = (db: Database.Database) => {
  const statements = {
    getPostById: db.prepare("SELECT * FROM posts WHERE id = ?"),
    getAllPosts: db.prepare("SELECT * FROM posts"),
    createPost: db.prepare(
      "INSERT INTO posts (img_url, caption) VALUES (?, ?)"
    ),
    // New prepared statement for getting reels
    getReelsForGrid: db.prepare("SELECT id, video_url, caption FROM reels"),
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

  // New reels transaction object
  const reels = {
    getForGrid: () => {
      return statements.getReelsForGrid.all() as ReelForGrid[];
    },
  };

  return {
    posts,
    reels, // Add reels to the returned object
  };
};

export { createTransactionHelpers };