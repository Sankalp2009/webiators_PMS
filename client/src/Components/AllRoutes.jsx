import { lazy} from "react";
import { Navigate, Route, Routes } from "react-router";
import PrivateRoute from "./PrivateRoute.jsx";


const Home = lazy(() => import("../Pages/Home.jsx"));
const Login = lazy(() => import("../Pages/Login.jsx"));
const Register = lazy(() => import("../Pages/Register.jsx"));
const ProductDetail = lazy(() => import("../Pages/ProductDetail.jsx"));
const Dashboard = lazy(() => import("../Pages/Dashboard.jsx"));
const NotFound = lazy(() => import("../Pages/NotFound.jsx"));
function AllRoutes() {
  return (
  
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Auth Route Public*/}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        
        {/* Dashboard Route Protected */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        {/* ProductDetail Route Protected */}
        <Route
          path="/product/:slug"
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default AllRoutes;