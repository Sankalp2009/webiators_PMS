import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../Model/userModel.js";
import Product from "../Model/productModel.js";
import {
  connectDB,
  disconnectDB,
  generateTestUser,
  generateTestProduct,
} from "./setup.js";

describe("Product CRUD API", () => {
  let authToken;
  let testUserId;
  let createdProductId;
  const testUser = generateTestUser();

  beforeAll(async () => {
    await connectDB();

    // Register and login to get auth token
    const registerRes = await request(app)
      .post("/api/v1/users/register")
      .send(testUser);

    authToken = registerRes.body.Token;
    testUserId = registerRes.body.User._id;
  });

  afterAll(async () => {
    // Clean up
    await Product.deleteMany({ createdBy: testUserId });
    await User.deleteOne({ email: testUser.email });
    await disconnectDB();
  });

  describe("POST /api/v1/products", () => {
    it("should create a product successfully", async () => {
      const productData = generateTestProduct(testUserId);

      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.productName).toBe(productData.productName);
      createdProductId = res.body.data._id;
    });

    it("should fail without authentication", async () => {
      const productData = generateTestProduct(testUserId);

      const res = await request(app).post("/api/v1/products").send(productData);

      expect(res.status).toBe(401);
    });

    it("should fail with invalid data (missing required fields)", async () => {
      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ productName: "Test" });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("should fail with duplicate slug", async () => {
      const productData = generateTestProduct(testUserId);
      // First create
      await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      // Try to create with same slug
      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(res.status).toBe(400);
    });

    it("should fail if discountedPrice >= price", async () => {
      const productData = {
        ...generateTestProduct(testUserId),
        slug: `test-invalid-price-${Date.now()}`,
        price: 50,
        discountedPrice: 60,
      };

      const res = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/products", () => {
    it("should get all products", async () => {
      const res = await request(app)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should fail without authentication", async () => {
      const res = await request(app).get("/api/v1/products");

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/v1/products/:id", () => {
    it("should get a product by ID", async () => {
      const res = await request(app)
        .get(`/api/v1/products/${createdProductId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data._id).toBe(createdProductId);
    });

    it("should return 404 for non-existent product", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app)
        .get(`/api/v1/products/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });

    it("should return 400 for invalid ID format", async () => {
      const res = await request(app)
        .get("/api/v1/products/invalidid")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/v1/products/:id", () => {
    it("should update a product successfully", async () => {
      const updateData = {
        productName: "Updated Product Name",
        price: 149.99,
      };

      const res = await request(app)
        .patch(`/api/v1/products/${createdProductId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.productName).toBe(updateData.productName);
      expect(res.body.data.price).toBe(updateData.price);
    });

    it("should fail with empty update body", async () => {
      const res = await request(app)
        .patch(`/api/v1/products/${createdProductId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent product", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app)
        .patch(`/api/v1/products/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ productName: "Test" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/products/:id", () => {
    it("should delete a product successfully", async () => {
      const res = await request(app)
        .delete(`/api/v1/products/${createdProductId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should return 404 when deleting already deleted product", async () => {
      const res = await request(app)
        .delete(`/api/v1/products/${createdProductId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });
});
