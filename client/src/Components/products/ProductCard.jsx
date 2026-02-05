import React from 'react';
import { Link } from 'react-router';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
} from '@mui/material';

const ProductCard = ({ product }) => {
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  // Get first image URL from galleryImages array
  const imageUrl = product.galleryImages?.[0]?.url || product.images?.[0] || '';

  return (
    <Card
      component={Link}
      to={`/product/${product.slug}`}
      sx={{
        textDecoration: 'none',
        display: 'block',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        '&:hover .product-image': {
          transform: 'scale(1.1)',
        },
        '&:hover .product-title': {
          color: 'primary.main',
        },
      }}
    >
      {/* Image Container */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={product.productName || product.name}
          className="product-image"
          sx={{
            aspectRatio: '1',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
        />
        {hasDiscount && (
          <Chip
            label={`-${discountPercent}%`}
            color="warning"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontWeight: 600,
            }}
          />
        )}
        {product.stock < 10 && product.stock > 0 && (
          <Chip
            label={`Only ${product.stock} left`}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'background.paper',
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: 1 }}
        >
          {product.category}
        </Typography>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          className="product-title"
          sx={{
            transition: 'color 0.2s',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {product.productName || product.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {hasDiscount ? (
            <>
              <Typography variant="h6" fontWeight={700} color="warning.main">
                ${product.discountedPrice?.toFixed(2)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${product.price.toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" fontWeight={700}>
              ${product.price.toFixed(2)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;