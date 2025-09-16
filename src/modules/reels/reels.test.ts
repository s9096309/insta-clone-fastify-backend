import Fastify, { FastifyInstance } from "fastify";
// This import will fail initially, which is part of the TDD process
import { reelsRoutes } from "./reels.routes";

describe("Reels Routes", () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = Fastify();
    app.register(reelsRoutes);
  });

  it("should get all reels for the grid and return them with a 200 status code", async () => {
    const mockReels = [
      { id: 1, video_url: "url1", caption: "First reel" },
      { id: 2, video_url: "url2", caption: "Second reel" },
    ];
    
    // Mock the transaction layer for reels
    app.decorate("transactions", {
      reels: {
        getForGrid: jest.fn().mockResolvedValue(mockReels),
      },
      // We also need to mock the posts object to avoid type errors
      posts: {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
      }
    });
  
    const response = await app.inject({
      method: "GET",
      url: "/reels/grid",
    });
  
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockReels);
  });
});