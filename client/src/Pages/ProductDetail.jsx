import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useProducts } from "../Context/ProductContext";
import ImageGallery from "../Components/products/ImageGallery.jsx";

const ProductDetail = () => {
  const { slug } = useParams();
  const { getProductBySlug } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        if (slug) {
          const foundProduct = getProductBySlug(slug);
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, getProductBySlug]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Product not found
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<ArrowBackIcon />}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  const hasDiscount =
    product.discountedPrice && product.discountedPrice < product.price;
  const savings = hasDiscount ? product.price - product.discountedPrice : 0;

  const features = [
    { icon: LocalShippingIcon, text: "Free shipping on orders over $50" },
    { icon: VerifiedUserIcon, text: "2-year warranty included" },
    { icon: InventoryIcon, text: "Easy 30-day returns" },
  ];

  // Transform galleryImages to simple array for ImageGallery component
  const images = product.galleryImages?.map(img => img.url) || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          color="text.secondary"
        >
          Products
        </MuiLink>
        <Typography color="text.primary">{product.productName}</Typography>
      </Breadcrumbs>

      <Grid container spacing={6}>
        {/* Image Gallery */}
        <Grid item xs={12} lg={6}>
          <Box className="slide-up">
            <ImageGallery images={images} productName={product.productName} />
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} lg={6}>
          <Box className="slide-up" sx={{ animationDelay: "0.1s" }}>
            {/* Category Badge */}
            <Chip label={product.category} size="small" sx={{ mb: 2 }} />

            {/* Title */}
            <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>
              {product.productName}
            </Typography>

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 1 }}
              >
                {hasDiscount ? (
                  <>
                    <Typography
                      variant="h3"
                      fontWeight={700}
                      color="warning.main"
                    >
                      ${product.discountedPrice?.toFixed(2)}
                    </Typography>
                    <Typography
                      variant="h5"
                      color="text.secondary"
                      sx={{ textDecoration: "line-through" }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Chip
                      label={`Save $${savings.toFixed(2)}`}
                      color="warning"
                      size="small"
                    />
                  </>
                ) : (
                  <Typography variant="h3" fontWeight={700}>
                    ${product.price.toFixed(2)}
                  </Typography>
                )}
              </Box>

              {/* Stock Status */}
              {product.stock > 0 ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight={500}
                  >
                    In Stock ({product.stock} available)
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="error.main" fontWeight={500}>
                  Out of Stock
                </Typography>
              )}
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                disabled={product.stock === 0}
                sx={{ flex: 1, py: 1.5 }}
              >
                Add to Cart
              </Button>
              <Button variant="outlined" size="large" sx={{ px: 2 }}>
                <FavoriteIcon />
              </Button>
            </Box>

            {/* Features */}
            <Divider sx={{ mb: 3 }} />
            <List disablePadding>
              {features.map((feature, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <feature.icon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.text}
                    primaryTypographyProps={{
                      color: "text.secondary",
                      variant: "body2",
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {/* Description */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Description
            </Typography>
            <Box
              sx={{ color: "text.secondary" }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;