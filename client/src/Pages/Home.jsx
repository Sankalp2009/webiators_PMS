import React, { useContext } from 'react';
import { Link } from "react-router";
import { Box, Container, Typography, Button, Grid, Chip, Paper, CircularProgress } from "@mui/material";
import ProductCard from '../Components/products/ProductCard.jsx';
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import { GlobalInfo } from '../Context/GlobalInfo.jsx';

const Home = () => {
  const { isAuth } = useContext(GlobalInfo);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(30, 58, 95, 0.05) 0%, transparent 50%, rgba(249, 115, 22, 0.05) 100%)",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, lg: 12 } }}>
          <Box
            className="slide-up"
            sx={{
              maxWidth: 800,
              mx: "auto",
              textAlign: "center",
            }}
          >
            <Chip
              icon={<AutoAwesomeIcon />}
              label="New arrivals just dropped"
              color="warning"
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                fontWeight: 700,
                letterSpacing: "-0.02em",
                mb: 3,
              }}
            >
              Discover Products{" "}
              <Box component="span" className="gradient-text">
                You'll Love
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", mb: 4, fontWeight: 400 }}
            >
              Explore our curated collection of premium products. From
              electronics to accessories, find everything you need in one place.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {isAuth ? (
                <>
                  <Button
                    component={Link}
                    to="/dashboard"
                    variant="contained"
                    size="large"
                    startIcon={<DashboardIcon />}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    component={Link}
                    to="/dashboard"
                    variant="outlined"
                    size="large"
                    startIcon={<InventoryIcon />}
                  >
                    Manage Products
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;