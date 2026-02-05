 import { createTheme } from '@mui/material/styles';
 
 // Deep Navy and Coral accent theme matching the previous design
 const theme = createTheme({
   palette: {
     mode: 'light',
     primary: {
       main: '#1e3a5f', // Deep Navy
       light: '#2d4a73',
       dark: '#152a47',
       contrastText: '#ffffff',
     },
     secondary: {
       main: '#e8ecf0',
       light: '#f5f7f9',
       dark: '#d1d8e0',
       contrastText: '#1e3a5f',
     },
     error: {
       main: '#ef4444',
       light: '#f87171',
       dark: '#dc2626',
     },
     warning: {
       main: '#f97316', // Coral accent
       light: '#fb923c',
       dark: '#ea580c',
       contrastText: '#ffffff',
     },
     success: {
       main: '#22c55e',
       light: '#4ade80',
       dark: '#16a34a',
     },
     background: {
       default: '#f8fafc',
       paper: '#ffffff',
     },
     text: {
       primary: '#1e293b',
       secondary: '#64748b',
     },
     divider: '#e2e8f0',
   },
   typography: {
     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
     h1: {
       fontWeight: 700,
       letterSpacing: '-0.02em',
     },
     h2: {
       fontWeight: 700,
       letterSpacing: '-0.02em',
     },
     h3: {
       fontWeight: 600,
       letterSpacing: '-0.01em',
     },
     h4: {
       fontWeight: 600,
     },
     h5: {
       fontWeight: 600,
     },
     h6: {
       fontWeight: 600,
     },
     button: {
       textTransform: 'none',
       fontWeight: 500,
     },
   },
   shape: {
     borderRadius: 12,
   },
   shadows: [
     'none',
     '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
     '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
     '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
     '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
     '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
   ],
   components: {
     MuiButton: {
       styleOverrides: {
         root: {
           borderRadius: 8,
           padding: '8px 16px',
           boxShadow: 'none',
           '&:hover': {
             boxShadow: 'none',
           },
         },
         sizeLarge: {
           padding: '12px 24px',
           fontSize: '1rem',
         },
         sizeSmall: {
           padding: '6px 12px',
         },
         containedPrimary: {
           '&:hover': {
             backgroundColor: '#2d4a73',
           },
         },
       },
     },
     MuiCard: {
       styleOverrides: {
         root: {
           borderRadius: 16,
           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
           border: '1px solid #e2e8f0',
         },
       },
     },
     MuiTextField: {
       styleOverrides: {
         root: {
           '& .MuiOutlinedInput-root': {
             borderRadius: 8,
           },
         },
       },
     },
     MuiChip: {
       styleOverrides: {
         root: {
           borderRadius: 6,
           fontWeight: 500,
         },
       },
     },
     MuiAppBar: {
       styleOverrides: {
         root: {
           backgroundColor: 'rgba(255, 255, 255, 0.8)',
           backdropFilter: 'blur(8px)',
           color: '#1e293b',
           boxShadow: 'none',
           borderBottom: '1px solid #e2e8f0',
         },
       },
     },
     MuiDrawer: {
       styleOverrides: {
         paper: {
           borderRight: '1px solid #e2e8f0',
         },
       },
     },
     MuiTableCell: {
       styleOverrides: {
         head: {
           fontWeight: 600,
           backgroundColor: '#f8fafc',
         },
       },
     },
     MuiDialog: {
       styleOverrides: {
         paper: {
           borderRadius: 16,
         },
       },
     },
   },
 });
 
 export default theme;