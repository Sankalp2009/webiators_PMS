 import React, { useState, useEffect, useContext } from 'react';
 import { Link, useNavigate } from 'react-router';
 import {
   Box,
   Container,
   Typography,
   TextField,
   Button,
   InputAdornment,
   CircularProgress,
   Link as MuiLink,
 } from '@mui/material';
 import EmailIcon from '@mui/icons-material/Email';
 import LockIcon from '@mui/icons-material/Lock';
 import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
 import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
 import { toast } from 'react-toastify';
 import { GlobalInfo } from '../Context/GlobalInfo.jsx';
 
 const Login = () => {
   const navigate = useNavigate();
   const { login, isAuth} = useContext(GlobalInfo);
   const [formData, setFormData] = useState({ email: '', password: '' });
   const [isLoading, setIsLoading] = useState(false);
 
   useEffect(() => {
     if (isAuth) {
       navigate('/dashboard');
     }
   }, [isAuth, navigate]);
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     setIsLoading(true);
 
     if (!formData.email || !formData.password) {
       toast.error('Please fill in all fields');
       setIsLoading(false);
       return;
     }
 
     const success = await login(formData.email, formData.password);
 
     if (success) {
       toast.success('Welcome back!');
       navigate('/dashboard');
     } else {
       toast.error('Invalid credentials. Password must be at least 6 characters.');
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
               Welcome back
             </Typography>
             <Typography color="text.secondary">
               Sign in to your account to continue
             </Typography>
           </Box>
 
           {/* Form */}
           <Box component="form" onSubmit={handleSubmit}>
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
 
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
               <Typography variant="body2" color="text.secondary">
                 Password
               </Typography>
               <MuiLink href="#" underline="hover" sx={{ fontSize: '0.875rem' }}>
                 Forgot password?
               </MuiLink>
             </Box>
             <TextField
               fullWidth
               type="password"
               placeholder="••••••••"
               value={formData.password}
               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
               {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
             </Button>
           </Box>
 
           {/* Sign up link */}
           <Typography sx={{ textAlign: 'center', mt: 3 }} color="text.secondary">
             Don't have an account?{' '}
             <MuiLink component={Link} to="/signup" underline="hover" fontWeight={500}>
               Create one
             </MuiLink>
           </Typography>
         </Box>
       </Box>
    </Box>
   );
 };

 export default Login;