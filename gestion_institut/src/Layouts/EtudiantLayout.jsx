import React, { useState } from "react";
import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import NavbarEtudiant from "../components/NavbarEtudiant";
import SidebarEtudiant from "../components/SidebarEtudiant";

const drawerWidth = 260;

const EtudiantLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex" }}>
      <NavbarEtudiant onMenuToggle={handleMenuToggle} isMenuOpen={isMenuOpen} />
      <SidebarEtudiant isOpen={isMenuOpen} onToggle={handleMenuToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 8,
          ml: !isMobile && isMenuOpen ? `${drawerWidth}px` : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default EtudiantLayout;
