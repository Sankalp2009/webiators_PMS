import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";

import { useProducts } from "../../Context/ProductContext.jsx";

import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const ProductForm = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { addProduct, updateProduct } = useProducts();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    metaTitle: product?.metaTitle || "",
    name: product?.name || "",
    slug: product?.slug || "",
    images: product?.images || [""],
    price: product?.price?.toString() || "",
    discountedPrice: product?.discountedPrice?.toString() || "",
    description: product?.description || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  useEffect(() => {
    if (!isEditing && formData.name) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.name) }));
    }
  }, [formData.name, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.metaTitle.trim()) {
      newErrors.metaTitle = "Meta title is required";
    } else if (formData.metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title must be under 60 characters";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "URL slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    const validImages = formData.images.filter((img) => img.trim());
    if (validImages.length === 0) {
      newErrors.images = "At least one image URL is required";
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (formData.discountedPrice) {
      const discounted = parseFloat(formData.discountedPrice);
      if (isNaN(discounted) || discounted <= 0) {
        newErrors.discountedPrice = "Invalid discounted price";
      } else if (discounted >= price) {
        newErrors.discountedPrice =
          "Discounted price must be less than regular price";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        metaTitle: formData.metaTitle.trim(),
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        images: formData.images.filter((img) => img.trim()),
        price: parseFloat(formData.price),
        discountedPrice: formData.discountedPrice
          ? parseFloat(formData.discountedPrice)
          : undefined,
        description: formData.description.trim(),
      };

      if (isEditing && product) {
        await updateProduct(product.id, productData);
        toast.success("Product updated successfully");
      } else {
        await addProduct(productData);
        toast.success("Product created successfully");
      }

      if (onClose) {
        onClose();
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Meta Title */}
      <TextField
        fullWidth
        label="Meta Title *"
        value={formData.metaTitle}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
        }
        placeholder="SEO-optimized title (max 60 characters)"
        error={!!errors.metaTitle}
        helperText={
          errors.metaTitle ||
          `Used for SEO and browser tabs (${formData.metaTitle.length}/60)`
        }
        margin="normal"
        disabled={loading}
      />

      {/* Product Name */}
      <TextField
        fullWidth
        label="Product Name *"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder="Enter product name"
        error={!!errors.name}
        helperText={errors.name}
        margin="normal"
        disabled={loading}
      />

      {/* URL Slug */}
      <TextField
        fullWidth
        label="URL Slug *"
        value={formData.slug}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, slug: e.target.value }))
        }
        placeholder="product-url-slug"
        error={!!errors.slug}
        helperText={errors.slug}
        margin="normal"
        disabled={loading}
      />

      {/* Images */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Gallery Images *
        </Typography>
        {formData.images.map((image, index) => (
          <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={image}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder="Enter image URL"
              error={!!errors.images && index === 0}
              disabled={loading}
            />
            {formData.images.length > 1 && (
              <IconButton
                color="error"
                onClick={() => removeImageField(index)}
                disabled={loading}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addImageField}
          sx={{ mt: 1 }}
          disabled={loading}
        >
          Add Image
        </Button>
        {errors.images && (
          <Typography variant="caption" color="error" display="block">
            {errors.images}
          </Typography>
        )}
      </Box>

      {/* Price and Discounted Price */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Price ($) *"
            type="number"
            inputProps={{ step: "0.01" }}
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, price: e.target.value }))
            }
            placeholder="0.00"
            error={!!errors.price}
            helperText={errors.price}
            margin="normal"
            disabled={loading}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Discounted Price ($)"
            type="number"
            inputProps={{ step: "0.01" }}
            value={formData.discountedPrice}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                discountedPrice: e.target.value,
              }))
            }
            placeholder="0.00"
            error={!!errors.discountedPrice}
            helperText={errors.discountedPrice}
            margin="normal"
            disabled={loading}
          />
        </Grid>
      </Grid>

      {/* Description */}
      <TextField
        fullWidth
        label="Description *"
        multiline
        rows={4}
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder="Enter product description (supports HTML for rich text)"
        error={!!errors.description}
        helperText={
          errors.description || "You can use HTML tags for formatting"
        }
        margin="normal"
        disabled={loading}
      />

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{ flex: 1 }}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Product"
              : "Create Product"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={() => (onClose ? onClose() : navigate("/dashboard"))}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
