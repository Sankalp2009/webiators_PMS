import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../Model/userModel.js";
import { connectDB, disconnectDB, generateTestUser } from "./setup.js";

describe("Authentication API", () => {
  let testUser;

  beforeAll(async () => {
    await connectDB();
    testUser = generateTestUser();
  });

  afterAll(async () => {
    // Clean up test user
    await User.deleteOne({ email: testUser.email });
    await disconnectDB();
  });

  describe("POST /api/v1/users/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/v1/users/register")
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.Token).toBeDefined();
      expect(res.body.User.email).toBe(testUser.email.toLowerCase());
      expect(res.body.User.password).toBeUndefined();
    });

    it("should fail with duplicate email", async () => {
      const res = await request(app)
        .post("/api/v1/users/register")
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("should fail with missing required fields", async () => {
      const res = await request(app)
        .post("/api/v1/users/register")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("POST /api/v1/users/login", () => {
    it("should login successfully with valid credentials", async () => {
      const res = await request(app).post("/api/v1/users/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.Token).toBeDefined();
    });

    it("should fail with invalid password", async () => {
      const res = await request(app).post("/api/v1/users/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe("fail");
    });

    it("should fail with non-existent email", async () => {
      const res = await request(app).post("/api/v1/users/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe("fail");
    });

    it("should fail with missing credentials", async () => {
      const res = await request(app).post("/api/v1/users/login").send({});

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("POST /api/v1/users/logout", () => {
    it("should logout successfully", async () => {
      const res = await request(app).post("/api/v1/users/logout");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });
  });
});
