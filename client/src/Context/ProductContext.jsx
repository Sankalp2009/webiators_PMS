/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { productAPI } from '../Utils/Api.js';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productAPI.getAllProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Get product by slug
  const getProductBySlug = (slug) => {
    return products.find((product) => product.slug === slug);
  };

  // Get product by ID
  const getProductById = async (id) => {
    try {
      const data = await productAPI.getProductById(id);
      return data.product;
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  };

  // Add product
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform data to match API schema
      const apiData = {
        metaTitle: productData.metaTitle,
        productName: productData.name,
        slug: productData.slug,
        price: productData.price,
        discountedPrice: productData.discountedPrice,
        description: productData.description,
        galleryImages: productData.images.map((url) => ({
          url,
          alt: productData.name,
        })),
        category: productData.category,
        stock: productData.stock,
        isActive: true,
      };

      const data = await productAPI.createProduct(apiData);
      
      // Refresh products list
      await fetchProducts();
      
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
      console.error('Error creating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);

      // Transform data to match API schema
      const apiData = {
        metaTitle: productData.metaTitle,
        productName: productData.name,
        slug: productData.slug,
        price: productData.price,
        discountedPrice: productData.discountedPrice,
        description: productData.description,
        galleryImages: productData.images.map((url) => ({
          url,
          alt: productData.name,
        })),
        category: productData.category,
        stock: productData.stock,
      };

      const data = await productAPI.updateProduct(id, apiData);
      
      // Refresh products list
      await fetchProducts();
      
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await productAPI.deleteProduct(id);
      
      // Refresh products list
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    getProductBySlug,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;