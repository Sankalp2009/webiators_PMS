import { describe, expect, it } from "vitest";
import Joi from "joi";

// Test the validation schemas directly
describe("Validation Schemas", () => {
  const slugSchema = Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(3)
    .max(100);

  const productSchema = Joi.object({
    metaTitle: Joi.string().min(3).max(60).required(),
    productName: Joi.string().min(3).max(200).required(),
    slug: slugSchema.required(),
    price: Joi.number().min(0).max(1000000).required(),
    discountedPrice: Joi.number().min(0).less(Joi.ref("price")).optional(),
    description: Joi.string().min(10).max(5000).required(),
    galleryImages: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          publicId: Joi.string().optional(),
          alt: Joi.string().max(200).optional(),
        })
      )
      .max(10)
      .optional(),
    isActive: Joi.boolean().optional(),
    createdBy: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  });

  describe("Slug Validation", () => {
    it("should accept valid slugs", () => {
      const validSlugs = ["product-name", "test123", "my-product-2024"];
      validSlugs.forEach((slug) => {
        const { error } = slugSchema.validate(slug);
        expect(error).toBeUndefined();
      });
    });

    it("should reject invalid slugs", () => {
      const invalidSlugs = [
        "Product-Name", // uppercase
        "product_name", // underscore
        "product--name", // double hyphen
        "-product", // starts with hyphen
        "product-", // ends with hyphen
        "ab", // too short
      ];
      invalidSlugs.forEach((slug) => {
        const { error } = slugSchema.validate(slug);
        expect(error).toBeDefined();
      });
    });
  });

  describe("Product Schema Validation", () => {
    const validProduct = {
      metaTitle: "Test Meta Title",
      productName: "Test Product",
      slug: "test-product",
      price: 99.99,
      description: "This is a valid product description.",
      createdBy: "507f1f77bcf86cd799439011",
    };

    it("should accept valid product data", () => {
      const { error } = productSchema.validate(validProduct);
      expect(error).toBeUndefined();
    });

    it("should reject missing required fields", () => {
      const { error } = productSchema.validate({ productName: "Test" });
      expect(error).toBeDefined();
    });

    it("should reject negative price", () => {
      const { error } = productSchema.validate({
        ...validProduct,
        price: -10,
      });
      expect(error).toBeDefined();
    });

    it("should reject discountedPrice >= price", () => {
      const { error } = productSchema.validate({
        ...validProduct,
        discountedPrice: 150,
      });
      expect(error).toBeDefined();
    });

    it("should reject short description", () => {
      const { error } = productSchema.validate({
        ...validProduct,
        description: "Short",
      });
      expect(error).toBeDefined();
    });

    it("should reject invalid gallery image URL", () => {
      const { error } = productSchema.validate({
        ...validProduct,
        galleryImages: [{ url: "not-a-url" }],
      });
      expect(error).toBeDefined();
    });

    it("should accept valid gallery images", () => {
      const { error } = productSchema.validate({
        ...validProduct,
        galleryImages: [
          { url: "https://example.com/image.jpg", alt: "Test" },
        ],
      });
      expect(error).toBeUndefined();
    });

    it("should reject too many gallery images", () => {
      const images = Array(11).fill({ url: "https://example.com/img.jpg" });
      const { error } = productSchema.validate({
        ...validProduct,
        galleryImages: images,
      });
      expect(error).toBeDefined();
    });

    it("should reject invalid createdBy format", () => {
      const { error } = productSchema.validate({
        ...validProduct,
        createdBy: "invalid-id",
      });
      expect(error).toBeDefined();
    });
  });
});
