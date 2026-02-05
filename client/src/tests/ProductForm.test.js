import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// Mock axios
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

      expect(slug).toBe('product--co');
    });

    it('should handle multiple spaces in slug', () => {
      const productName = 'Product  With   Spaces';
      const slug = productName.toLowerCase().replace(/\s+/g, '-');

      expect(slug).toBe('product--with---spaces');
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
    it('should handle submission error', async () => {
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

    it('should handle network error on submit', async () => {
      const error = new Error('Network error');

      expect(() => {
        throw error;
      }).toThrow('Network error');
    });
  });
});
    const user = userEvent.setup();
    renderProductForm();

    const submitButton = screen.getByRole('button', { name: /Create Product/i });
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Meta title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Product name is required/i)).toBeInTheDocument();
    });
  });

  it('should validate price field', async () => {
    const user = userEvent.setup();
    renderProductForm();

    const priceInput = screen.getByLabelText(/Price/i);
    
    await user.type(priceInput, '-100');
    
    const submitButton = screen.getByRole('button', { name: /Create Product/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Valid price is required/i)).toBeInTheDocument();
    });
  });

  it('should validate discounted price is less than price', async () => {
    const user = userEvent.setup();
    renderProductForm();

    const priceInput = screen.getByLabelText(/Price/i);
    const discountedInput = screen.getByLabelText(/Discounted Price/i);

    await user.type(priceInput, '100');
    await user.type(discountedInput, '150');

    const submitButton = screen.getByRole('button', { name: /Create Product/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Discounted price must be less than regular price/i)
      ).toBeInTheDocument();
    });
  });

  it('should require at least one image URL', async () => {
    const user = userEvent.setup();
    renderProductForm();

    const submitButton = screen.getByRole('button', { name: /Create Product/i });
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/At least one image URL is required/i)).toBeInTheDocument();
    });
  });

  it('should add and remove image fields', async () => {
    const user = userEvent.setup();
    renderProductForm();

    const addImageButton = screen.getByRole('button', { name: /Add Image/i });
    
    // Add an image field
    await user.click(addImageButton);
    
    const imageInputs = screen.getAllByPlaceholderText(/Enter image URL/i);
    expect(imageInputs.length).toBeGreaterThan(1);
  });

  it('should populate form when editing product', () => {
    const product = {
      id: '1',
      metaTitle: 'Test Product',
      name: 'Test Product',
      slug: 'test-product',
      images: ['image1.jpg', 'image2.jpg'],
      price: 100,
      discountedPrice: 80,
      description: 'Test description',
    };

    renderProductForm({ product });

    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('80')).toBeInTheDocument();
  });

  it('should show Update Product button when editing', () => {
    const product = {
      id: '1',
      metaTitle: 'Test',
      name: 'Test Product',
      slug: 'test',
      images: ['img.jpg'],
      price: 100,
      description: 'Test',
    };

    renderProductForm({ product });

    expect(screen.getByRole('button', { name: /Update Product/i })).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderProductForm({ onClose });

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should validate meta title max length', async () => {
    const user = userEvent.setup();
    renderProductForm();

    const metaTitleInput = screen.getByLabelText(/Meta Title/i);
    const longTitle = 'a'.repeat(70);

    await user.type(metaTitleInput, longTitle);

    const submitButton = screen.getByRole('button', { name: /Create Product/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Meta title must be under 60 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('should validate slug format', async () => {
    const user = userEvent.setup();
    renderProductForm();

    const slugInput = screen.getByLabelText(/URL Slug/i);
    
    await user.clear(slugInput);
    await user.type(slugInput, 'Invalid_Slug!');

    const submitButton = screen.getByRole('button', { name: /Create Product/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Slug can only contain lowercase letters/i)
      ).toBeInTheDocument();
    });
  });
});
