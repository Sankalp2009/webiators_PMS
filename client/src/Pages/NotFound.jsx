 import { useLocation } from "react-router";
 import { useEffect } from "react";
 import { Box, Typography, Button, Container } from "@mui/material";
 import HomeIcon from "@mui/icons-material/Home";
 
 const NotFound = () => {
   const location = useLocation();
 
   useEffect(() => {
     console.error("404 Error: User attempted to access non-existent route:", location.pathname);
   }, [location.pathname]);
 
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
       <Container maxWidth="sm">
         <Box sx={{ textAlign: "center" }}>
           <Typography variant="h1" fontWeight={700} color="primary" gutterBottom>
             404
           </Typography>
           <Typography variant="h5" color="text.secondary" gutterBottom>
             Oops! Page not found
           </Typography>
           <Typography color="text.secondary" sx={{ mb: 4 }}>
             The page you're looking for doesn't exist or has been moved.
           </Typography>
           <Button
             href="/"
             variant="contained"
             startIcon={<HomeIcon />}
             size="large"
           >
             Return to Home
           </Button>
         </Box>
       </Container>
     </Box>
   );
 };
 
 export default NotFound;