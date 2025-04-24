import request from "supertest";
import app from "./app";

describe("API Integration Tests", () => {
  // Users endpoint
  describe("GET /api/users", () => {
    it("should return paginated users with default pagination", async () => {
      const response = await request(app).get("/api/users");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.metadata).toHaveProperty("total");
      expect(response.body.metadata).toHaveProperty("page");
      expect(response.body.metadata).toHaveProperty("limit");
    });

    it("should apply pagination parameters", async () => {
      const response = await request(app).get("/api/users?page=2&limit=10");
      expect(response.status).toBe(200);
      expect(response.body.metadata.page).toBe(2);
      expect(response.body.metadata.limit).toBe(10);
      expect(response.body.data.length).toBeLessThanOrEqual(10);
    });

    it("should handle invalid parameters", async () => {
      const response = await request(app).get(
        "/api/users?page=invalid&limit=500"
      );
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // Filters endpoint
  describe("GET /api/filters", () => {
    it("should return filter options", async () => {
      const response = await request(app).get("/api/filters");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nationalities).toBeInstanceOf(Array);
      expect(response.body.data.hobbies).toBeInstanceOf(Array);
    });
  });

  // In-memory Worker endpoint
  describe("Web Worker API", () => {
    it("should accept job requests and return a request ID", async () => {
      const response = await request(app)
        .post("/api/worker/process")
        .send({ data: "Test job data" });

      expect(response.status).toBe(202);
      expect(response.body.success).toBe(true);
      expect(response.body.requestId).toBeDefined();
      expect(response.body.status).toBe("pending");
    });

    it("should return queue status", async () => {
      const response = await request(app).get("/api/worker/status");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.queue).toBeDefined();
    });
  });

  // Redis Worker endpoint
  describe("Redis Worker API", () => {
    it("should accept job requests and return a request ID", async () => {
      const response = await request(app)
        .post("/api/redis-worker/process")
        .send({ data: "Test Redis job data" });

      expect(response.status).toBe(202);
      expect(response.body.success).toBe(true);
      expect(response.body.requestId).toBeDefined();
      expect(response.body.status).toBe("pending");
      expect(response.body.queue).toBe("redis");
    });

    it("should return queue status", async () => {
      const response = await request(app).get("/api/redis-worker/queue");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.queue).toBeDefined();
    });

    it("should handle job retrieval", async () => {
      // First submit a job to get an ID
      const submitResponse = await request(app)
        .post("/api/redis-worker/process")
        .send({ data: "Test job for retrieval" });

      const jobId = submitResponse.body.requestId;

      // Now try to retrieve it
      const response = await request(app).get(`/api/redis-worker/job/${jobId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.job).toBeDefined();
      expect(response.body.job.id).toBe(jobId);
    });
  });

  // 404 Handler
  describe("404 Handler", () => {
    it("should return 404 for non-existing routes", async () => {
      const response = await request(app).get("/non-existing-route");
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
