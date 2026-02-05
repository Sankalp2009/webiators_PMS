import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { toast } from "react-toastify";
import { GlobalInfo } from "../Context/GlobalInfo.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(GlobalInfo);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success(result.message || "Login successful");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBagIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>
              ShopHub
            </Typography>
          </Box>
        </Box>

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            Welcome back
          </Typography>
          <Typography color="text.secondary">
            Sign in to your account
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            endIcon={!isLoading && <ArrowForwardIcon />}
            sx={{ mt: 3 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign in"}
          </Button>
        </Box>

        <Typography sx={{ textAlign: "center", mt: 3 }}>
          Don't have an account?{" "}
          <MuiLink component={Link} to="/signup">
            Create one
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
