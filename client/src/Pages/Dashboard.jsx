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
import AdminSidebar from "../Components/layout/AdminSidebar.jsx";
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleEdit = (product) => {
    // Transform product data from API format to form format
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <SecurityIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
              Admin Dashboard
            </Typography>
            <Chip label="Admin" size="small" sx={{ mr: 2 }} />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingProduct(undefined);
                setIsFormOpen(true);
              }}
            >
              Add Product
            </Button>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ p: 3, flex: 1, bgcolor: "background.default" }}>
          {/* Stats */}
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Overview
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card>
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: stat.bgColor,
                        color: stat.color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      <InventoryIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Table */}
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Product Management
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.light" }}>
                    <TableCell width={70}>Image</TableCell>
                    <TableCell sx={{ minWidth: 200 }}>Product</TableCell>
                    <TableCell align="right" sx={{ minWidth: 100 }}>
                      Price
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 150 }}>
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
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>
                        <Avatar
                          variant="rounded"
                          src={product.galleryImages?.[0]?.url}
                          alt={product.productName}
                          sx={{ width: 48, height: 48, objectFit: "cover" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {product.productName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          /{product.slug}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          {product.discountedPrice ? (
                            <>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                color="success.main"
                              >
                                ${product.discountedPrice.toFixed(2)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
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
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 0.75,
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            size="small"
                            title="View"
                            onClick={() => navigate(`/product/${product.slug}`)}
                            sx={{
                              color: "primary.main",
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
                        sx={{ textAlign: "center", py: 6 }}
                      >
                        <InventoryIcon
                          sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                        />
                        <Typography color="text.secondary">
                          No products yet
                        </Typography>
                        <Button
                          onClick={() => setIsFormOpen(true)}
                          sx={{ mt: 1 }}
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

      {/* Product Form Dialog */}
      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { maxHeight: "90vh" } }}
      >
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent dividers>
          <ProductForm product={editingProduct} onClose={handleFormClose} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
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
