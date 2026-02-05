import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuIcon from '@mui/icons-material/Menu';
import SecurityIcon from '@mui/icons-material/Security';
import { toast } from 'react-toastify';
import { GlobalInfo } from '../Context/GlobalInfo.jsx';
import { useProducts } from '../Context/ProductContext';
import AdminSidebar from '../Components/Layout/AdminSidebar';
import ProductForm from '../Components/Products/ProductForm';

const DRAWER_WIDTH = 280;

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuth } = useContext(GlobalInfo);
  const { products, loading, deleteProduct } = useProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  const handleEdit = (product) => {
    // Transform product data from API format to form format
    const formData = {
      id: product._id,
      metaTitle: product.metaTitle,
      name: product.productName,
      slug: product.slug,
      images: product.galleryImages?.map(img => img.url) || [],
      price: product.price,
      discountedPrice: product.discountedPrice,
      description: product.description,
      category: product.category,
      stock: product.stock,
    };
    setEditingProduct(formData);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setDeleteConfirmId(null);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product',error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  if (!isAuth) {
    return null;
  }

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      color: 'primary.main',
      bgColor: 'primary.light',
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          <AdminSidebar />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
          open
        >
          <AdminSidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
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
        <Box sx={{ p: 3, flex: 1, bgcolor: 'background.default' }}>
          {/* Stats */}
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Overview
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={80}>Image</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      Category
                    </TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell
                      align="center"
                      sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                    >
                      Stock
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product._id}
                      hover
                      sx={{
                        '&:hover .action-buttons': { opacity: 1 },
                      }}
                    >
                      <TableCell>
                        <Avatar
                          variant="rounded"
                          src={product.galleryImages?.[0]?.url}
                          alt={product.productName}
                          sx={{ width: 48, height: 48 }}
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
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Chip label={product.category} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        {product.discountedPrice ? (
                          <Box>
                            <Typography variant="body2" fontWeight={600} color="warning.main">
                              ${product.discountedPrice.toFixed(2)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              ${product.price.toFixed(2)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" fontWeight={500}>
                            ${product.price.toFixed(2)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Chip
                          label={product.stock}
                          size="small"
                          color={product.stock > 0 ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          className="action-buttons"
                          sx={{
                            opacity: { xs: 1, md: 0 },
                            transition: 'opacity 0.2s',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/product/${product.slug}`)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleEdit(product)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteConfirmId(product._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                        <InventoryIcon
                          sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography color="text.secondary">No products yet</Typography>
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
        PaperProps={{ sx: { maxHeight: '90vh' } }}
      >
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent dividers>
          <ProductForm product={editingProduct} onClose={handleFormClose} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
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