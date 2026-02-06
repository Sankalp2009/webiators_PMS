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
  Paper,
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
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug, getProductBySlug]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
        }}
      >
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

  const images = product.galleryImages?.map((img) => img.url) || [];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              color: "text.secondary", 
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Back to Products
          </Button>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>

        <Grid container spacing={{ xs: 4, md: 6 }}>

          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: { xs: "relative", md: "sticky" },
                top: { md: 100 },
                height: "fit-content",
              }}
            >
              <ImageGallery 
                images={images} 
                productName={product.productName} 
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ pl: { md: 4 } }}>

              <Chip
                label={product.category || "Product"}
                size="small"
                color="primary"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 28, sm: 34, md: 40 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: -0.5,
                  mb: 3,
                }}
              >
                {product.productName}
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 2,
                  }}
                >
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
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Chip
                        label={`Save $${savings.toFixed(2)}`}
                        color="error"
                        size="small"
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
                      ${product.price?.toFixed(2)}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: product.stock > 0 ? "success.main" : "error.main",
                      boxShadow: product.stock > 0 
                        ? "0 0 0 3px rgba(76, 175, 80, 0.1)"
                        : "0 0 0 3px rgba(244, 67, 54, 0.1)",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: product.stock > 0 ? "success.main" : "error.main",
                      fontWeight: 600,
                    }}
                  >
                    {product.stock > 0 
                      ? `In Stock • ${product.stock} available`
                      : "Out of Stock"
                    }
                  </Typography>
                </Box>
              </Paper>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 5,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  disabled={product.stock === 0}
                  sx={{
                    flex: 1,
                    py: 1.75,
                    fontSize: 16,
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<FavoriteIcon />}
                  sx={{
                    py: 1.75,
                    px: 3,
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Save
                </Button>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  What's Included
                </Typography>
                <List disablePadding>
                  {features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
                        <feature.icon />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.text}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    mb: 2.5,
                  }}
                >
                  About This Product
                </Typography>
                <Box
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.8,
                    fontSize: 15,
                    "& p": { mb: 2 },
                    "& ul": { ml: 2.5, mb: 2, pl: 1 },
                    "& li": { mb: 1 },
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
