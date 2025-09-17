import Fastify, { FastifyInstance } from "fastify";
import { highlightsRoutes } from "./highlights.routes";

describe("Highlights Routes", () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = Fastify();
    app.register(highlightsRoutes);
  });

  // Test case 1: Get all highlights
  it("should get all highlights and return them with a 200 status code", async () => {
    const mockHighlights = [
      { id: 1, cover_image_url: "url1", title: "Highlight 1" },
      { id: 2, cover_image_url: "url2", title: "Highlight 2" },
    ];
    
    app.decorate("transactions", {
      highlights: {
        getAll: jest.fn().mockResolvedValue(mockHighlights),
        getById: jest.fn(),
      },
      posts: { create: jest.fn(), getAll: jest.fn(), getById: jest.fn() },
      reels: { getForGrid: jest.fn() },
      tagged: { getForGrid: jest.fn() },
    });
  
    const response = await app.inject({
      method: "GET",
      url: "/highlights",
    });
  
    // --- Assert ---
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockHighlights);
  });

  // Test case 2: Get a single highlight by its ID
  it("should get a single highlight by id and return it with a 200 status code", async () => {
    const mockHighlight = { id: 1, cover_image_url: "url1", title: "Highlight 1" };
    
    app.decorate("transactions", {
      highlights: {
        getAll: jest.fn(),
        getById: jest.fn().mockResolvedValue(mockHighlight),
      },
      posts: { create: jest.fn(), getAll: jest.fn(), getById: jest.fn() },
      reels: { getForGrid: jest.fn() },
      tagged: { getForGrid: jest.fn() },
    });
  
    const response = await app.inject({
      method: "GET",
      url: "/highlights/1",
    });
  
    // --- Assert ---
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockHighlight);
  });
});