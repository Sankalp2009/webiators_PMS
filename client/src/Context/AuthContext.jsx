import React, { useState } from "react";
import { GlobalInfo } from "./GlobalInfo.jsx";
import { InitialState } from "./InitialState.jsx";
import axios from "axios";

const AuthContext = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      return {
        user: JSON.parse(storedUser),
        isAuth: true,
        token: storedToken,
      };
    }
    return InitialState;
  });

  // 🔴 LOGIN
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://webiators-pms.onrender.com/api/v1/users/login",
        { email, password }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        user,
        isAuth: true,
        token,
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Please try again.",
      };
    }
  };

  // 🔴 SIGNUP
  const signup = async (username, email, password) => {
    try {
      const response = await axios.post(
        "https://webiators-pms.onrender.com/api/v1/users/register",
        { username, email, password }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        user,
        isAuth: true,
        token,
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setAuthState({
      user: null,
      isAuth: false,
      token: null,
    });
  };

  return (
    <GlobalInfo.Provider value={{ ...authState, login, signup, logout }}>
      {children}
    </GlobalInfo.Provider>
  );
};

export default AuthContext;
