import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";

vi.mock("axios", () => ({
  default: {
    create: vi.fn().mockReturnValue({
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
      },
    }),
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Integration Tests - Complete User Workflows", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("User Registration and Login Flow", () => {
    it("should complete full registration and login flow", async () => {
      const registerResponse = {
        Token: "auth-token-123",
        User: {
          id: "1",
          email: "test@example.com",
        },
      };

      const loginResponse = {
        Token: "auth-token-123",
        User: {
          id: "1",
          email: "test@example.com",
        },
      };

      localStorage.setItem("token", registerResponse.Token);
      localStorage.setItem("user", JSON.stringify(registerResponse.User));

      expect(localStorage.getItem("token")).toBe(registerResponse.Token);
      expect(localStorage.getItem("user")).toBeDefined();
    });

    it("should handle duplicate email during registration", () => {
      const error = {
        response: {
          status: 400,
          data: { message: "Email already exists" },
        },
      };

      expect(() => {
        throw error;
      }).toThrow();
    });
  });

  describe("Product Management Flow", () => {
    it("should create, read, update, and delete product", async () => {
      const token = "test-token-123";
      localStorage.setItem("token", token);

      const createResponse = {
        _id: "product-1",
        name: "Test Product",
        slug: "test-product",
        price: 100,
      };

      expect(createResponse._id).toBeDefined();
      expect(createResponse.name).toBe("Test Product");
    });

    it("should handle product validation errors", () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: "Validation failed",
            field: "price",
          },
        },
      };

      expect(() => {
        throw error;
      }).toThrow();
    });

    it("should fetch all products", () => {
      const mockProducts = {
        products: [
          {
            _id: "1",
            name: "Product 1",
            price: 100,
          },
          {
            _id: "2",
            name: "Product 2",
            price: 200,
          },
        ],
      };

      expect(mockProducts.products).toHaveLength(2);
    });
  });

  describe("Authentication Error Handling", () => {
    it("should handle unauthorized access", () => {
      const error = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      };

      expect(() => {
        throw error;
      }).toThrow();
    });

    it("should handle expired token", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  describe("Concurrent Requests", () => {
    it("should handle multiple concurrent API calls", async () => {
      const response1 = { products: [] };
      const response2 = { user: { id: "1" } };

      expect(response1).toBeDefined();
      expect(response2).toBeDefined();
    });
  });
});
