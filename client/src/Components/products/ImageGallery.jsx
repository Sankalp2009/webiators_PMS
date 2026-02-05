 import React, { useState } from 'react';
 import { Box, IconButton, Chip } from '@mui/material';
 import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
 import ChevronRightIcon from '@mui/icons-material/ChevronRight';
 
 const ImageGallery = ({ images, productName }) => {
   const [selectedIndex, setSelectedIndex] = useState(0);
 
   const handlePrevious = () => {
     setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
   };
 
   const handleNext = () => {
     setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
   };
 
   return (
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
       {/* Main Image */}
       <Box
         sx={{
           position: 'relative',
           aspectRatio: '1',
           overflow: 'hidden',
           borderRadius: 3,
           bgcolor: 'grey.100',
           '&:hover .nav-button': {
             opacity: 1,
           },
         }}
       >
         <Box
           component="img"
           src={images[selectedIndex]}
           alt={`${productName} - Image ${selectedIndex + 1}`}
           key={selectedIndex}
           sx={{
             width: '100%',
             height: '100%',
             objectFit: 'cover',
           }}
         />
 
         {images.length > 1 && (
           <>
             <IconButton
               className="nav-button"
               onClick={handlePrevious}
               sx={{
                 position: 'absolute',
                 left: 12,
                 top: '50%',
                 transform: 'translateY(-50%)',
                 bgcolor: 'background.paper',
                 opacity: 0,
                 transition: 'opacity 0.2s',
                 boxShadow: 2,
                 '&:hover': { bgcolor: 'background.paper' },
               }}
             >
               <ChevronLeftIcon />
             </IconButton>
             <IconButton
               className="nav-button"
               onClick={handleNext}
               sx={{
                 position: 'absolute',
                 right: 12,
                 top: '50%',
                 transform: 'translateY(-50%)',
                 bgcolor: 'background.paper',
                 opacity: 0,
                 transition: 'opacity 0.2s',
                 boxShadow: 2,
                 '&:hover': { bgcolor: 'background.paper' },
               }}
             >
               <ChevronRightIcon />
             </IconButton>
           </>
         )}
 
         {/* Image Counter */}
         {images.length > 1 && (
           <Chip
             label={`${selectedIndex + 1} / ${images.length}`}
             size="small"
             sx={{
               position: 'absolute',
               bottom: 12,
               left: '50%',
               transform: 'translateX(-50%)',
               bgcolor: 'rgba(0,0,0,0.7)',
               color: 'white',
             }}
           />
         )}
       </Box>
 
       {/* Thumbnail Gallery */}
       {images.length > 1 && (
         <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
           {images.map((image, index) => (
             <Box
               key={index}
               component="button"
               onClick={() => setSelectedIndex(index)}
               sx={{
                 width: 80,
                 height: 80,
                 flexShrink: 0,
                 borderRadius: 2,
                 overflow: 'hidden',
                 border: 'none',
                 padding: 0,
                 cursor: 'pointer',
                 opacity: index === selectedIndex ? 1 : 0.6,
                 outline: index === selectedIndex ? '2px solid' : 'none',
                 outlineColor: 'primary.main',
                 outlineOffset: 2,
                 transition: 'all 0.2s',
                 '&:hover': {
                   opacity: 1,
                 },
               }}
             >
               <Box
                 component="img"
                 src={image}
                 alt={`${productName} thumbnail ${index + 1}`}
                 sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
               />
             </Box>
           ))}
         </Box>
       )}
     </Box>
   );
 };
 
 export default ImageGallery;