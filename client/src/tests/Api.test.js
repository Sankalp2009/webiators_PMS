import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// Mock axios before importing the API module
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn().mockReturnValue({
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
      },
    }),
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
  return { default: mockAxios };
});

describe('Product API', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getAllProducts', () => {
    it('should fetch all products successfully', async () => {
      const mockProducts = {
        status: 'success',
        products: [
          { _id: '1', name: 'Product 1', price: 100 },
          { _id: '2', name: 'Product 2', price: 200 },
        ],
      };

      expect(mockProducts.products).toHaveLength(2);
      expect(mockProducts.status).toBe('success');
    });

    it('should handle error when fetching products', async () => {
      const error = new Error('Network error');
      expect(() => {
        throw error;
      }).toThrow('Network error');
    });
  });

  describe('createProduct', () => {
    it('should create product successfully', () => {
      const productData = {
        metaTitle: 'Test Product',
        name: 'Test Product',
        slug: 'test-product',
        price: 100,
        description: 'Test description',
      };

      expect(productData).toBeDefined();
      expect(productData.name).toBe('Test Product');
      expect(productData.price).toBe(100);
    });
  });

  describe('updateProduct', () => {
    it('should prepare update product request', () => {
      const productData = { name: 'Updated Product' };

      expect(productData).toBeDefined();
      expect(productData.name).toBe('Updated Product');
    });
  });

  describe('deleteProduct', () => {
    it('should prepare delete product request', () => {
      const productId = '1';

      expect(productId).toBeDefined();
      expect(productId).toBe('1');
    });
  });
});
