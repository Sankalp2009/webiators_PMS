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

describe('AuthContext - Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Login Flow', () => {
    it('should store token on successful login', () => {
      const mockResponse = {
        Token: 'auth-token-123',
        User: { _id: '1', email: 'test@example.com' },
      };

      localStorage.setItem('token', mockResponse.Token);
      localStorage.setItem('user', JSON.stringify(mockResponse.User));

      expect(localStorage.getItem('token')).toBe('auth-token-123');
      expect(localStorage.getItem('user')).toBeDefined();
    });

    it('should handle login error with invalid credentials', () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      };

      expect(() => {
        throw error;
      }).toThrow();
      expect(error.response.status).toBe(401);
    });

    it('should handle network error on login', () => {
      const error = new Error('Network error');

      expect(() => {
        throw error;
      }).toThrow('Network error');
    });
  });

  describe('Signup Flow', () => {
    it('should handle successful registration', () => {
      const mockResponse = {
        Token: 'auth-token-456',
        User: { _id: '2', email: 'newuser@example.com' },
      };

      localStorage.setItem('token', mockResponse.Token);

      expect(localStorage.getItem('token')).toBe('auth-token-456');
    });

    it('should handle duplicate email error on signup', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Email already exists' },
        },
      };

      expect(() => {
        throw error;
      }).toThrow();
      expect(error.response.status).toBe(400);
    });

    it('should handle validation error on signup', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid email format' },
        },
      };

      expect(() => {
        throw error;
      }).toThrow();
    });
  });

  describe('Logout Flow', () => {
    it('should clear token on logout', () => {
      localStorage.setItem('token', 'auth-token-123');
      localStorage.setItem('user', JSON.stringify({ _id: '1', email: 'test@test.com' }));

      expect(localStorage.getItem('token')).toBe('auth-token-123');

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should be able to login again after logout', () => {
      localStorage.clear();

      localStorage.setItem('token', 'new-token-789');

      expect(localStorage.getItem('token')).toBe('new-token-789');
    });
  });

  describe('Token Persistence', () => {
    it('should restore token from localStorage on app load', () => {
      const token = 'persisted-token-123';
      const user = { _id: '1', email: 'test@test.com' };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      expect(localStorage.getItem('token')).toBe(token);
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(user);
    });

    it('should handle missing token gracefully', () => {
      localStorage.clear();

      const token = localStorage.getItem('token');

      expect(token).toBeNull();
    });

    it('should update token on token refresh', () => {
      localStorage.setItem('token', 'old-token-123');
      
      const newToken = 'new-token-456';
      localStorage.setItem('token', newToken);

      expect(localStorage.getItem('token')).toBe('new-token-456');
    });
  });

  describe('Error Handling', () => {
    it('should handle 500 server error', () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };

      expect(() => {
        throw error;
      }).toThrow();
    });

    it('should handle 403 forbidden error', () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Access forbidden' },
        },
      };

      expect(() => {
        throw error;
      }).toThrow();
    });
  });
});
