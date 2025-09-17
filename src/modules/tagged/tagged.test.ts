import Fastify, { FastifyInstance } from "fastify";
import { taggedRoutes } from "./tagged.routes";

describe("Tagged Routes", () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = Fastify();
    app.register(taggedRoutes);
  });

  it("should get all tagged posts for the grid and return them with a 200 status code", async () => {
    const mockTaggedPosts = [
      { id: 1, img_url: "url1", caption: "A tagged photo!", user_who_tagged: "Tom" },
      { id: 2, img_url: "url2", caption: "Another one!", user_who_tagged: "Maria" },
    ];
    
    app.decorate("transactions", {
      posts: {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
      },
      reels: {
        getForGrid: jest.fn(),
      },
      tagged: {
        getForGrid: jest.fn().mockResolvedValue(mockTaggedPosts),
      },
      highlights: {
        getAll: jest.fn(),
        getById: jest.fn(),
      },
    });
  
    const response = await app.inject({
      method: "GET",
      url: "/tagged/grid",
    });
  
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockTaggedPosts);
  });
});