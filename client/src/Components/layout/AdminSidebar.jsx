import React, { useContext } from "react";
import { Link, useLocation } from "react-router";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import SecurityIcon from "@mui/icons-material/Security";
import { GlobalInfo } from "../Context/GlobalInfo.jsx";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: DashboardIcon },
  { title: "Products", url: "/dashboard", icon: InventoryIcon },
  { title: "Orders", url: "/dashboard", icon: ShoppingCartIcon },
  { title: "Customers", url: "/dashboard", icon: PeopleIcon },
];

const catalogItems = [
  { title: "Categories", url: "/dashboard", icon: CategoryIcon },
  { title: "Analytics", url: "/dashboard", icon: AssessmentIcon },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(GlobalInfo);

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
            <SecurityIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Admin Panel
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ShopHub
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
        <Typography variant="overline" sx={{ px: 2, color: "text.secondary" }}>
          Main Menu
        </Typography>
        <List disablePadding>
          {mainNavItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                component={Link}
                to={item.url}
                selected={isActive(item.url) && item.title === "Dashboard"}
                sx={{ mx: 1, borderRadius: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <Typography variant="overline" sx={{ px: 2, color: "text.secondary" }}>
          Catalog
        </Typography>
        <List disablePadding>
          {catalogItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                component={Link}
                to={item.url}
                sx={{ mx: 1, borderRadius: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/dashboard"
              sx={{ mx: 1, borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/dashboard"
              sx={{ mx: 1, borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Help Center" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 32,
              height: 32,
              fontSize: 14,
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || "A"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
          <IconButton size="small" onClick={logout} color="error">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSidebar;