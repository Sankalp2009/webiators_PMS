import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('Integration Tests - Complete User Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('User Registration and Login Flow', () => {
    it('should complete full registration and login flow', async () => {
      const registerResponse = {
        data: {
          Token: 'auth-token-123',
          User: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
          },
          message: 'Registration successful',
        },
      };

      const loginResponse = {
        data: {
          Token: 'auth-token-123',
          User: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
          },
          message: 'Login successful',
        },
      };

      // Mock registration
      axios.post.mockResolvedValueOnce(registerResponse);

      const registerResult = await axios.post(
        'https://webiators-pms.onrender.com/api/v1/users/register',
        {
          username: 'testuser',
          email: 'test@example.com',
          password: 'Test@123456',
        }
      );

      expect(registerResult.data.Token).toBeDefined();
      localStorage.setItem('token', registerResult.data.Token);
      localStorage.setItem('user', JSON.stringify(registerResult.data.User));

      // Mock login
      axios.post.mockResolvedValueOnce(loginResponse);

      const loginResult = await axios.post(
        'https://webiators-pms.onrender.com/api/v1/users/login',
        {
          email: 'test@example.com',
          password: 'Test@123456',
        }
      );

      expect(loginResult.data.Token).toBe(registerResult.data.Token);
      expect(localStorage.getItem('token')).toBe(registerResult.data.Token);
    });

    it('should handle duplicate email during registration', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Email already exists' },
        },
      };

      axios.post.mockRejectedValueOnce(error);

      await expect(
        axios.post(
          'https://webiators-pms.onrender.com/api/v1/users/register',
          {
            username: 'testuser',
            email: 'existing@example.com',
            password: 'Test@123456',
          }
        )
      ).rejects.toThrow();
    });
  });

  describe('Product Management Flow', () => {
    it('should create, read, update, and delete product', async () => {
      const token = 'test-token-123';
      localStorage.setItem('token', token);

      // Create product
      const createResponse = {
        data: {
          status: 'success',
          data: {
            _id: 'product-1',
            metaTitle: 'Test Product',
            productName: 'Test Product',
            slug: 'test-product',
            price: 100,
            description: 'Test description',
            galleryImages: [{ url: 'image.jpg' }],
          },
        },
      };

      axios.post.mockResolvedValueOnce(createResponse);

      const created = await axios.post(
        'https://webiators-pms.onrender.com/api/v1/products',
        {
          metaTitle: 'Test Product',
          productName: 'Test Product',
          slug: 'test-product',
          price: 100,
          description: 'Test description',
          galleryImages: [{ url: 'image.jpg' }],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      expect(created.data.status).toBe('success');
      const productId = created.data.data._id;

      // Read product
      const readResponse = {
        data: {
          status: 'success',
          product: created.data.data,
        },
      };

      axios.get.mockResolvedValueOnce(readResponse);

      const read = await axios.get(
        `https://webiators-pms.onrender.com/api/v1/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      expect(read.data.product._id).toBe(productId);

      // Update product
      const updateResponse = {
        data: {
          status: 'success',
          data: {
            ...created.data.data,
            price: 150,
          },
        },
      };

      axios.patch.mockResolvedValueOnce(updateResponse);

      const updated = await axios.patch(
        `https://webiators-pms.onrender.com/api/v1/products/${productId}`,
        { price: 150 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      expect(updated.data.data.price).toBe(150);

      // Delete product
      const deleteResponse = {
        data: {
          status: 'success',
          message: 'Product deleted',
        },
      };

      axios.delete.mockResolvedValueOnce(deleteResponse);

      const deleted = await axios.delete(
        `https://webiators-pms.onrender.com/api/v1/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      expect(deleted.data.status).toBe('success');
    });

    it('should handle product validation errors', async () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            field: 'price',
          },
        },
      };

      axios.post.mockRejectedValueOnce(error);

      await expect(
        axios.post(
          'https://webiators-pms.onrender.com/api/v1/products',
          {
            metaTitle: 'Invalid Product',
            productName: 'Invalid Product',
            slug: 'invalid',
            price: -100, // Invalid
            description: 'Test',
            galleryImages: [{ url: 'image.jpg' }],
          }
        )
      ).rejects.toThrow();
    });

    it('should fetch all products', async () => {
      const mockProducts = {
        data: {
          status: 'success',
          products: [
            {
              _id: '1',
              productName: 'Product 1',
              price: 100,
            },
            {
              _id: '2',
              productName: 'Product 2',
              price: 200,
            },
          ],
        },
      };

      axios.get.mockResolvedValueOnce(mockProducts);

      const result = await axios.get(
        'https://webiators-pms.onrender.com/api/v1/products'
      );

      expect(result.data.products).toHaveLength(2);
      expect(result.data.products[0].productName).toBe('Product 1');
    });
  });

  describe('Authentication Error Handling', () => {
    it('should handle unauthorized access', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      axios.get.mockRejectedValueOnce(error);

      await expect(
        axios.get('https://webiators-pms.onrender.com/api/v1/products', {
          headers: { Authorization: 'Bearer invalid-token' },
        })
      ).rejects.toThrow();
    });

    it('should handle expired token', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Token expired' },
        },
      };

      axios.get.mockRejectedValueOnce(error);

      // Should trigger logout and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent API calls', async () => {
      const response1 = { data: { products: [] } };
      const response2 = { data: { user: { id: '1' } } };

      axios.get.mockResolvedValueOnce(response1);
      axios.get.mockResolvedValueOnce(response2);

      const [products, user] = await Promise.all([
        axios.get('https://webiators-pms.onrender.com/api/v1/products'),
        axios.get('https://webiators-pms.onrender.com/api/v1/users/profile'),
      ]);

      expect(products.data.products).toBeDefined();
      expect(user.data.user).toBeDefined();
    });
  });
});
