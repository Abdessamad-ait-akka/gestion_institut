import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, useTheme, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import SchoolIcon from "@mui/icons-material/School";

// Liens spécifiques pour l’interface professeur
const navLinks = [
  { path: "/admin", label: "Accueil" },
  { path: "/etudiantDashboard", label: "Etudiant" },
  { path: "/profDashboard", label: "Prof" },
  { path: "/users", label: "Users" },
];

const NavbarAdmin = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(13, 36, 66, 0.95)", "rgba(13, 36, 66, 1)"]
  );

  return (
    <motion.div style={{ backgroundColor }}>
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: "blur(8px)" }}>
        <Toolbar sx={{ justifyContent: "space-between", maxWidth: 1280, mx: "auto", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <SchoolIcon sx={{ fontSize: 32, color: theme.palette.secondary.main }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
                background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Espace Admin
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  variant="text"
                  sx={{
                    position: "relative",
                    color: isActive ? theme.palette.secondary.main : "#e0e0e0",
                    textTransform: "none",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      style={{
                        position: "absolute",
                        bottom: 4,
                        left: 0,
                        right: 0,
                        height: 2,
                        backgroundColor: theme.palette.secondary.main,
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default NavbarAdmin;
