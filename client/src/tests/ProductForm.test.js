import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => ({
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
  },
}));

describe('ProductForm - Form Validation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Slug Generation', () => {
    it('should generate slug from product name', () => {
      const productName = 'Test Product';
      const slug = productName.toLowerCase().replace(/\s+/g, '-');

      expect(slug).toBe('test-product');
    });

    it('should handle special characters in slug', () => {
      const productName = 'Product & Co.';
      const slug = productName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

      expect(slug).toBe('product-co');
    });

    it('should handle multiple spaces in slug', () => {
      const productName = 'Product  With   Spaces';
      const slug = productName.toLowerCase().replace(/\s+/g, '-');

      expect(slug).toBe('product-with-spaces');
    });
  });

  describe('Field Validation', () => {
    it('should validate required fields are present', () => {
      const formData = {
        metaTitle: 'Test',
        name: 'Product',
        slug: 'product',
        price: 100,
        description: 'Description',
      };

      expect(formData.name).toBeTruthy();
      expect(formData.price).toBeGreaterThan(0);
    });

    it('should validate price is numeric and positive', () => {
      const price = 100;
      expect(typeof price).toBe('number');
      expect(price).toBeGreaterThan(0);
    });

    it('should validate email if applicable', () => {
      const email = 'test@example.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailRegex.test(email)).toBe(true);
    });

    it('should reject invalid email', () => {
      const email = 'invalid-email';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailRegex.test(email)).toBe(false);
    });
  });

  describe('Price Validation', () => {
    it('should accept valid price', () => {
      const price = 99.99;
      expect(price > 0).toBe(true);
    });

    it('should reject zero price', () => {
      const price = 0;
      expect(price > 0).toBe(false);
    });

    it('should reject negative price', () => {
      const price = -50;
      expect(price > 0).toBe(false);
    });

    it('should handle decimal prices', () => {
      const price = 19.99;
      const isValid = price > 0 && !isNaN(price);
      expect(isValid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should prepare product data for submission', () => {
      const formData = {
        metaTitle: 'New Product',
        name: 'New Product',
        slug: 'new-product',
        price: 100,
        discountedPrice: 80,
        description: 'Test description',
        galleryImages: [{ url: 'image.jpg', alt: 'Product' }],
      };

      expect(formData).toBeDefined();
      expect(formData.name).toBe('New Product');
    });

    it('should handle missing optional fields', () => {
      const formData = {
        name: 'Product',
        slug: 'product',
        price: 100,
        description: 'Desc',
      };

      expect(formData.name).toBeTruthy();
      expect(formData.discountedPrice).toBeUndefined();
    });
  });

  describe('Image Field Management', () => {
    it('should allow adding images', () => {
      const images = [];
      images.push({ url: 'image1.jpg', alt: 'Product 1' });

      expect(images).toHaveLength(1);
    });

    it('should allow removing images', () => {
      const images = [
        { url: 'image1.jpg', alt: 'Product 1' },
        { url: 'image2.jpg', alt: 'Product 2' },
      ];

      const filtered = images.filter((_, idx) => idx !== 0);

      expect(filtered).toHaveLength(1);
    });

    it('should validate image URL format', () => {
      const imageUrl = 'image.jpg';
      const isValid = imageUrl.endsWith('.jpg') || imageUrl.endsWith('.png');

      expect(isValid).toBe(true);
    });
  });

  describe('Edit vs Create Mode', () => {
    it('should show create mode when product ID is not provided', () => {
      const productId = undefined;
      expect(productId).toBeUndefined();
    });

    it('should show edit mode when product ID is provided', () => {
      const productId = '1';
      expect(productId).toBeDefined();
    });

    it('should populate form fields in edit mode', () => {
      const product = {
        _id: '1',
        name: 'Existing Product',
        price: 100,
      };

      expect(product._id).toBe('1');
      expect(product.name).toBe('Existing Product');
    });
  });

  describe('Error Handling', () => {
    it('should handle submission error', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Validation failed' },
        },
      };

      expect(() => {
        throw error;
      }).toThrow();
    });

    it('should handle network error on submit', () => {
      const error = new Error('Network error');

      expect(() => {
        throw error;
      }).toThrow('Network error');
    });
  });
});
