import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { GlobalInfo } from "../../Context/GlobalInfo.jsx";

const Header = () => {
  const { user, isAuth, logout } = useContext(GlobalInfo);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 64 }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
              "&:hover .logo-icon": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box
              className="logo-icon"
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s",
              }}
            >
              <ShoppingBagIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} letterSpacing="-0.02em">
              ShopHub
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 6, gap: 3 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "text.primary" },
              }}
            >
              Products
            </Button>
            {isAuth && (
              <Button
                component={Link}
                to="/dashboard"
                color="inherit"
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "text.primary" },
                }}
              >
                Dashboard
              </Button>
            )}
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Desktop Actions */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {isAuth ? (
              <>
                <Chip
                  avatar={
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  label={user?.username}
                  variant="outlined"
                  sx={{ borderColor: "divider" }}
                />
                <IconButton onClick={handleLogout} size="small">
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" color="inherit">
                  Log in
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  color="primary"
                >
                  Sign up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary="Products" />
              </ListItemButton>
            </ListItem>
            {isAuth && (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider sx={{ my: 2 }} />
          {isAuth ? (
            <>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2">{user?.username}</Typography>
              </Box>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  sx={{ color: "error.main" }}
                >
                  <ListItemText primary="Log out" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}
            >
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;