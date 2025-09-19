import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import Database from "better-sqlite3";
import {
  createTransactionHelpers,
  type TransactionHelpers,
} from "./database.transactions";

declare module "fastify" {
  interface FastifyInstance {
    db: Database.Database;
    transactions: TransactionHelpers;
  }
}

async function databasePluginHelper(fastify: FastifyInstance) {
  const db = new Database("./database.db");
  fastify.log.info("SQLite database connection established.");

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      img_url TEXT NOT NULL,
      caption TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    -- FIX: Added the thumbnail_url and views columns to the reels table --
    CREATE TABLE IF NOT EXISTS reels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_url TEXT NOT NULL,
      thumbnail_url TEXT,
      caption TEXT,
      views INTEGER -- THIS IS THE LINE THAT WAS MISSING
    );
    CREATE TABLE IF NOT EXISTS tagged_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      user_who_tagged TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts(id)
    );
    CREATE TABLE IF NOT EXISTS highlights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cover_image_url TEXT NOT NULL,
      title TEXT
    );
  `);

  // --- Seed Data ---
  // ... (posts and tagged posts seeding is the same)
  const postsCount = db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
  if (postsCount.count === 0) {
    fastify.log.info("Seeding posts...");
    db.exec(`
      INSERT INTO posts (img_url, caption) VALUES
      ('https://images.unsplash.com/photo-1518791841217-8f162f1e1131', 'A valid post!'),
      ('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 'Another cute cat.');
    `);
  }

  const taggedCount = db.prepare('SELECT COUNT(*) as count FROM tagged_posts').get() as { count: number };
  if (taggedCount.count === 0) {
    fastify.log.info("Seeding tagged posts...");
    db.exec(`INSERT INTO tagged_posts (post_id, user_who_tagged) VALUES (1, 'Maria');`);
  }

  // Seed Reels
  const reelsCount = db.prepare('SELECT COUNT(*) as count FROM reels').get() as { count: number };
  if (reelsCount.count === 0) {
    fastify.log.info("Seeding reels...");
    db.exec(`
      INSERT INTO reels (video_url, thumbnail_url, caption, views) VALUES
      ('https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', '/images/image1.jpg', 'A cute bunny', 0),
      ('https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4', '/images/image2.jpg', 'A swimming jellyfish', 0),
      ('https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4', '/images/image3.jpg', 'A great horned owl', 0);
    `);
  }

  // Seed Highlights
  const highlightsCount = db.prepare('SELECT COUNT(*) as count FROM highlights').get() as { count: number };
  if (highlightsCount.count === 0) {
    fastify.log.info("Seeding highlights...");
    db.exec(`
      INSERT INTO highlights (cover_image_url, title) VALUES
      ('/images/image4.jpg', 'Trips'),
      ('/images/image5.jpg', 'Friends');
    `);
  }

  const transactions = createTransactionHelpers(db);

  fastify.decorate("db", db);
  fastify.decorate("transactions", transactions);

  fastify.addHook("onClose", (instance, done) => {
    instance.db.close();
    instance.log.info("SQLite database connection closed.");
    done();
  });
}

const databasePlugin = fp(databasePluginHelper);

export { databasePlugin };