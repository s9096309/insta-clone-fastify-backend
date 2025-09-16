import Fastify, { FastifyInstance } from "fastify";
import { postsRoutes } from "./posts.routes";

describe("Posts Routes", () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = Fastify();
    app.register(postsRoutes);
  });

  it("should create a new post and return it with a 201 status code", async () => {
    const newPostPayload = {
      img_url: "http://example.com/new-image.jpg",
      caption: "A brand new post from our test!",
    };
    const createdPost = { ...newPostPayload, id: 1, created_at: new Date().toISOString() };

    app.decorate("transactions", {
      posts: {
        create: jest.fn().mockResolvedValue(createdPost),
        getAll: jest.fn(),
        getById: jest.fn(),
      },
      // Add the reels mock to match the real object's shape
      reels: {
        getForGrid: jest.fn(),
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/posts",
      payload: newPostPayload,
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toEqual(createdPost);
  });

  it("should get all posts and return them with a 200 status code", async () => {
    const mockPosts = [
      { id: 1, caption: "First post", img_url: "url1", created_at: new Date().toISOString() },
      { id: 2, caption: "Second post", img_url: "url2", created_at: new Date().toISOString() },
    ];
    
    app.decorate("transactions", {
      posts: {
        getAll: jest.fn().mockResolvedValue(mockPosts),
        create: jest.fn(),
        getById: jest.fn(),
      },
      // Add the reels mock here as well
      reels: {
        getForGrid: jest.fn(),
      },
    });
  
    const response = await app.inject({
      method: "GET",
      url: "/posts",
    });
  
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockPosts);
  });
});