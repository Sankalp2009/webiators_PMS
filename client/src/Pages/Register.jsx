 import React, { useState, useContext } from 'react';
 import { Link, useNavigate } from 'react-router';
 import {
   Box,
   Typography,
   TextField,
   Button,
   InputAdornment,
   CircularProgress,
   Link as MuiLink,
 } from '@mui/material';
 import PersonIcon from '@mui/icons-material/Person';
 import EmailIcon from '@mui/icons-material/Email';
 import LockIcon from '@mui/icons-material/Lock';
 import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
 import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
 import { toast } from 'react-toastify';
  import { GlobalInfo } from '../Context/GlobalInfo.jsx';
 
 const Register = () => {
   const navigate = useNavigate();
    const { signup } = useContext(GlobalInfo);
   const [formData, setFormData] = useState({ username: '', email: '', password: '' });
   const [isLoading, setIsLoading] = useState(false);
 
    
 
   const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  if (!formData.username || !formData.email || !formData.password) {
    toast.error("Please fill in all fields");
    setIsLoading(false);
    return;
  }

  if (formData.password.length < 6) {
    toast.error("Password must be at least 6 characters");
    setIsLoading(false);
    return;
  }

  const result = await signup(
    formData.username,
    formData.email,
    formData.password
  );

  if (result.success) {
    toast.success(result.message || "Account created");
    navigate("/dashboard");
  } else {
    toast.error(result.message); 
  }

  setIsLoading(false);
};

 
   return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
       <Box
         sx={{
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           p: 4,
         }}
       >
         <Box className="fade-in" sx={{ width: '100%', maxWidth: 400 }}>
           {/* Logo */}
           <Box sx={{ textAlign: 'center', mb: 4 }}>
             <Box
               component={Link}
               to="/"
               sx={{
                 display: 'inline-flex',
                 alignItems: 'center',
                 gap: 1,
                 textDecoration: 'none',
                 color: 'inherit',
               }}
             >
               <Box
                 sx={{
                   width: 48,
                   height: 48,
                   borderRadius: 2,
                   bgcolor: 'primary.main',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                 }}
               >
                 <ShoppingBagIcon sx={{ color: 'white', fontSize: 24 }} />
               </Box>
               <Typography variant="h5" fontWeight={700}>
                 ShopHub
               </Typography>
             </Box>
           </Box>
 
           {/* Header */}
           <Box sx={{ textAlign: 'center', mb: 4 }}>
             <Typography variant="h4" fontWeight={700} gutterBottom>
               Create your account
             </Typography>
             <Typography color="text.secondary">
               Get started with your free account
             </Typography>
           </Box>
 
           {/* Form */}
           <Box component="form" onSubmit={handleSubmit}>
             <TextField
               fullWidth
               label="Username"
               placeholder="johndoe"
               value={formData.username}
               onChange={(e) => setFormData({ ...formData, username: e.target.value })}
               margin="normal"
               InputProps={{
                 startAdornment: (
                   <InputAdornment position="start">
                     <PersonIcon color="action" />
                   </InputAdornment>
                 ),
               }}
             />
 
             <TextField
               fullWidth
               label="Email address"
               type="email"
               placeholder="you@example.com"
               value={formData.email}
               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               margin="normal"
               InputProps={{
                 startAdornment: (
                   <InputAdornment position="start">
                     <EmailIcon color="action" />
                   </InputAdornment>
                 ),
               }}
             />
 
             <TextField
               fullWidth
               label="Password"
               type="password"
               placeholder="••••••••"
               value={formData.password}
               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
               margin="normal"
               helperText="Must be at least 6 characters"
               InputProps={{
                 startAdornment: (
                   <InputAdornment position="start">
                     <LockIcon color="action" />
                   </InputAdornment>
                 ),
               }}
             />
 
             <Button
               type="submit"
               variant="contained"
               fullWidth
               size="large"
               disabled={isLoading}
               endIcon={!isLoading && <ArrowForwardIcon />}
               sx={{ mt: 3, py: 1.5 }}
             >
               {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create account'}
             </Button>
           </Box>
 
           {/* Terms */}
           <Typography sx={{ textAlign: 'center', mt: 3, fontSize: '0.75rem' }} color="text.secondary">
             By creating an account, you agree to our{' '}
             <MuiLink href="#" underline="hover">
               Terms of Service
             </MuiLink>{' '}
             and{' '}
             <MuiLink href="#" underline="hover">
               Privacy Policy
             </MuiLink>
           </Typography>
 
           {/* Login link */}
           <Typography sx={{ textAlign: 'center', mt: 2 }} color="text.secondary">
             Already have an account?{' '}
             <MuiLink component={Link} to="/login" underline="hover" fontWeight={500}>
               Sign in
             </MuiLink>
           </Typography>
         </Box>
       </Box>
    </Box>
   );
 };
 
 export default Register;