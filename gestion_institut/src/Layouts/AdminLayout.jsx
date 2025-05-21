import React, { useState } from "react";
import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const drawerWidth = 220;

const AdminLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navbar */}
      <Navbar
  onMenuToggle={handleMenuToggle}
  isMenuOpen={isMenuOpen}
  drawerWidth={drawerWidth}
/>

      {/* Sidebar (gestionne mobile vs desktop dans le composant) */}
      <Sidebar isOpen={isMenuOpen} onToggle={handleMenuToggle} />

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 8, // espace sous la navbar
          ml: !isMobile && isMenuOpen ? `${drawerWidth}px` : 0, // décalage uniquement si menu ouvert
          transition: "margin-left 0.3s ease",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
