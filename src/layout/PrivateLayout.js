import * as React from "react";
import Box from "@mui/material/Box";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function PrivateLayout({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token)
    return (
      <Navigate to={`/login`} replace state={{ from: location.pathname }} />
    );
  else
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flex: 1 }} width={`calc(100% - 250px)`}>
          <Header />
          <Box component="main" flex={1} p={2}>
            {children}
          </Box>
        </Box>
      </Box>
    );
}
