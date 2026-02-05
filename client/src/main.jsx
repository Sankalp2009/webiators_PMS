import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import AuthContext from "./Context/AuthContext.jsx";
import ProductContext from "./Context/ProductContext.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <AuthContext>
      <ProductContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProductContext>
    </AuthContext>
  </ThemeProvider>,
);
