import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardContent,
  Grid,
  Avatar,
  CircularProgress,
} from "@mui/material";

import ProductForm from "../Components/products/ProductForm.jsx";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InventoryIcon from "@mui/icons-material/Inventory";
import SecurityIcon from "@mui/icons-material/Security";
import { toast } from "react-toastify";
import { useProducts } from "../Context/ProductContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { products, loading, deleteProduct } = useProducts();

  console.log("Products in Dashboard:", products);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleEdit = (product) => {
  
    const formData = {
      id: product._id,
      metaTitle: product.metaTitle,
      name: product.productName,
      slug: product.slug,
      images: product.galleryImages?.map((img) => img.url) || [],
      price: product.price,
      discountedPrice: product.discountedPrice,
      description: product.description,
    };
    setEditingProduct(formData);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setDeleteConfirmId(null);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product", error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      color: "primary.main",
      bgColor: "primary.light",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            zIndex: 10,
          }}
        >
          <Toolbar sx={{ px: 3, py: 1 }}>
            <SecurityIcon color="primary" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
              Admin Dashboard
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingProduct(undefined);
                setIsFormOpen(true);
              }}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Add Product
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Overview
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card sx={{ height: "100%", boxShadow: 1, borderRadius: 1 }}>
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: stat.bgColor,
                        color: stat.color,
                        width: 56,
                        height: 56,
                      }}
                    >
                      <InventoryIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: 12 }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ mt: 0.5 }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Product Management
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 1, boxShadow: 1 }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell width={70} sx={{ fontWeight: 600 }}>
                      Image
                    </TableCell>
                    <TableCell sx={{ minWidth: 200, fontWeight: 600 }}>
                      Product
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ minWidth: 100, fontWeight: 600 }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ minWidth: 120, fontWeight: 600 }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product._id}
                      hover
                      sx={{
                        transition: "background-color 0.2s",
                        "&:hover": {
                          bgcolor: "#fafafa",
                        },
                        height: 72,
                      }}
                    >
                      <TableCell sx={{ py: 1 }}>
                        <Avatar
                          variant="rounded"
                          src={product.galleryImages?.[0]?.url}
                          alt={product.productName}
                          sx={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 0.5,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ mb: 0.5 }}
                        >
                          {product.productName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          /{product.slug}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1 }}>
                        <Box>
                          {product.discountedPrice ? (
                            <>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                color="success.main"
                                sx={{ mb: 0.25 }}
                              >
                                ${product.discountedPrice.toFixed(2)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  textDecoration: "line-through",
                                  display: "block",
                                }}
                              >
                                ${product.price.toFixed(2)}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" fontWeight={600}>
                              ${product.price.toFixed(2)}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 0.5,
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            size="small"
                            title="View"
                            onClick={() => navigate(`/product/${product.slug}`)}
                            sx={{
                              color: "primary.main",
                              padding: "6px",
                              "&:hover": { bgcolor: "primary.light" },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="Edit"
                            onClick={() => handleEdit(product)}
                            sx={{
                              color: "info.main",
                              padding: "6px",
                              "&:hover": { bgcolor: "info.light" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            title="Delete"
                            color="error"
                            onClick={() => setDeleteConfirmId(product._id)}
                            sx={{
                              padding: "6px",
                              "&:hover": { bgcolor: "error.light" },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ textAlign: "center", py: 8 }}
                      >
                        <InventoryIcon
                          sx={{ fontSize: 56, color: "text.disabled", mb: 1 }}
                        />
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                          No products yet
                        </Typography>
                        <Button
                          onClick={() => setIsFormOpen(true)}
                          variant="contained"
                        >
                          Add your first product
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
            borderRadius: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {editingProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <ProductForm product={editingProduct} onClose={handleFormClose} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        PaperProps={{
          sx: { borderRadius: 1 },
        }}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteConfirmId(null)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;