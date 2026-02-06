/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { productAPI } from "../Utils/Api.js";
import { GlobalInfo } from "./GlobalInfo.jsx";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const { isAuth } = useContext(GlobalInfo);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getAllProducts();
      console.log("Fetched products:", response);

      if (response.status === "success" && response.data) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch products";
      setError(errorMessage);
      console.error("Error fetching products:", err);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuth) {
      setProducts([]);
      return;
    }
    fetchProducts();
  }, [isAuth]);

  const getProductBySlug = (slug) => {
    return products.find((product) => product.slug === slug);
  };

  const getProductById = async (id) => {
    try {
      const response = await productAPI.getProductById(id);

      return response.data;
    } catch (err) {
      console.error("Error fetching product:", err);
      throw err;
    }
  };

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);

      const apiData = {
        metaTitle: productData.metaTitle,
        productName: productData.name,
        slug: productData.slug,
        price: productData.price,
        discountedPrice: productData.discountedPrice,
        description: productData.description,
        galleryImages: productData.images?.map((url) => ({
          url,
          alt: productData.name,
        })) || [],
        isActive: true,
      };

      const response = await productAPI.createProduct(apiData);

      await fetchProducts();
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create product";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);

      const apiData = {
        metaTitle: productData.metaTitle,
        productName: productData.name,
        slug: productData.slug,
        price: productData.price,
        discountedPrice: productData.discountedPrice,
        description: productData.description,
        galleryImages: productData.images?.map((url) => ({
          url,
          alt: productData.name,
        })) || [],
      };

      const response = await productAPI.updateProduct(id, apiData);

      await fetchProducts();
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update product";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setError(null);

      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));

      await productAPI.deleteProduct(id);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete product";
      setError(errorMessage);

      await fetchProducts();
      throw err;
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
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductProvider;