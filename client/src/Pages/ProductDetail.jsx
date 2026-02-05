import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import ImageGallery from "../Components/products/ImageGallery.jsx";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useProducts } from "../Context/ProductContext";

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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", py: 12 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          Product not found
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          size="large"
        >
          Back to Products
        </Button>
      </Box>
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
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header with Back Button - Full Width */}
      <Box sx={{ 
        bgcolor: "background.paper", 
        borderBottom: 1, 
        borderColor: "divider",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ color: "text.secondary", textTransform: "none" }}
          >
            Back to Products
          </Button>
        </Container>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          {/* LEFT COLUMN - Image Gallery (5/12 width) */}
          <Grid item xs={12} md={5}>
            <Box 
              className="slide-up" 
              sx={{ 
                position: "sticky", 
                top: 100,
                height: "fit-content",
              }}
            >
              <ImageGallery images={images} productName={product.productName} />
            </Box>
          </Grid>

          {/* RIGHT COLUMN - Product Info (7/12 width) */}
          <Grid item xs={12} md={7}>
            <Box 
              className="slide-up" 
              sx={{ 
                animationDelay: "0.1s",
                pl: { md: 4 }, // Extra padding on desktop for better spacing
              }}
            >
              {/* Category Badge */}
              <Chip 
                label={product.category || "Product"} 
                size="small" 
                sx={{ 
                  mb: 2, 
                  width: "fit-content",
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }} 
              />

              {/* Title */}
              <Typography 
                variant="h2" 
                fontWeight={700} 
                sx={{ 
                  mb: 3, 
                  lineHeight: 1.2,
                  letterSpacing: -0.5,
                  fontSize: { xs: 28, sm: 36, md: 40 }
                }}
              >
                {product.productName}
              </Typography>

              {/* Price Section */}
              <Box sx={{ mb: 4, pb: 3, borderBottom: 1, borderColor: "divider" }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, flexWrap: "wrap", mb: 2 }}>
                  {hasDiscount ? (
                    <>
                      <Typography
                        sx={{
                          fontSize: { xs: 36, sm: 44 },
                          fontWeight: 700,
                          color: "primary.main",
                        }}
                      >
                        ${product.discountedPrice?.toFixed(2)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: 20, sm: 24 },
                          color: "text.secondary",
                          textDecoration: "line-through",
                          fontWeight: 500,
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Chip
                        label={`Save $${savings.toFixed(2)}`}
                        color="error"
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 700 }}
                      />
                    </>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: { xs: 36, sm: 44 },
                        fontWeight: 700,
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                  )}
                </Box>

                {/* Stock Status */}
                <Box sx={{ mt: 2 }}>
                  {product.stock > 0 ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "success.main",
                          boxShadow: "0 0 0 3px rgba(76, 175, 80, 0.1)",
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="success.main"
                        fontWeight={600}
                      >
                        In Stock • {product.stock} available
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "error.main",
                          boxShadow: "0 0 0 3px rgba(244, 67, 54, 0.1)",
                        }}
                      />
                      <Typography variant="body2" color="error.main" fontWeight={600}>
                        Out of Stock
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Actions */}
              <Box sx={{ display: "flex", gap: 2, mb: 5, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  disabled={product.stock === 0}
                  sx={{ 
                    flex: { xs: "1 1 100%", sm: 1 },
                    py: 1.75,
                    fontSize: 16,
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 1,
                  }}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  sx={{ 
                    px: 3,
                    py: 1.75,
                    borderRadius: 1,
                    minWidth: { xs: "100%", sm: "auto" },
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 22 }} />
                </Button>
              </Box>

              {/* Features */}
              <Box sx={{ mb: 5, pb: 4, borderBottom: 1, borderColor: "divider" }}>
                <List disablePadding>
                  {features.map((feature, index) => (
                    <ListItem 
                      key={index} 
                      sx={{ 
                        px: 0, 
                        py: 1.5,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44, color: "primary.main" }}>
                        <feature.icon />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.text}
                        primaryTypographyProps={{
                          color: "text.primary",
                          variant: "body2",
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Description */}
              <Box>
                <Typography 
                  variant="h6" 
                  fontWeight={700} 
                  sx={{ mb: 2.5, fontSize: 18 }}
                >
                  About This Product
                </Typography>
                <Box
                  sx={{ 
                    color: "text.secondary",
                    lineHeight: 1.8,
                    fontSize: 15,
                    "& p": {
                      mb: 2,
                    },
                    "& ul": {
                      ml: 2.5,
                      mb: 2,
                    },
                    "& li": {
                      mb: 1,
                    },
                    "& h1, & h2, & h3, & h4, & h5, & h6": {
                      color: "text.primary",
                      fontWeight: 600,
                      mt: 3,
                      mb: 1.5,
                    },
                    "& strong": {
                      color: "text.primary",
                      fontWeight: 600,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetail;
