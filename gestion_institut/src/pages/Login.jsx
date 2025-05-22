import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  InputAdornment,
} from "@mui/material";
import { Link as RouterLink, useNavigate, Navigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Redirection si déjà connecté (simulé)
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simule une connexion simple
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      if (rememberMe) {
        localStorage.setItem("loggedIn", "true");
      }
      navigate("/");
    } else {
      setError("Identifiants invalides. Essayez 'admin' / 'admin123'.");
    }
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Grid container sx={{ height: "100%", width: "100%" }}>
        {/* Partie gauche - formulaire */}
        <Grid
          item
          xs={12}
          md={7.2}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            height: "100%",
            p: { xs: 2, sm: 4 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <SchoolIcon sx={{ color: "#0c2340", fontSize: 40, mr: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0c2340" }}>
              ENTS
            </Typography>
          </Box>

          <Box component={RouterLink} to="/signup" sx={{ display: "flex", alignItems: "center", mb: 4, textDecoration: "none" }}>
            <HelpOutlineIcon sx={{ color: "#aaa", mr: 1, fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: "#888" }}>I do not have an account yet</Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: "#0c2340" }}>
            Login to your account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: "400px" }}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#aaa" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1,
                  backgroundColor: "#f5f8ff",
                  border: "1px solid #e0e0e0",
                  "& fieldset": { border: "none" },
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#aaa" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1,
                  backgroundColor: "#f5f8ff",
                  border: "1px solid #e0e0e0",
                  "& fieldset": { border: "none" },
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: "#aaa", '&.Mui-checked': { color: "#0c2340" } }}
                />
              }
              label={<Typography variant="body2" sx={{ color: "#666" }}>Remember Me</Typography>}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 30,
                backgroundColor: "#0c2340",
                "&:hover": {
                  backgroundColor: "#0a1c30",
                },
              }}
              type="submit"
            >
              Log in
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, cursor: "pointer", color: "#888", "&:hover": { color: "#0c2340" } }}>
            Forgot password?
          </Typography>

          {error && (
            <Typography variant="body2" sx={{ color: "red", mt: 2 }}>
              {error}
            </Typography>
          )}
        </Grid>

        {/* Partie droite - panneau décoratif */}
        <Grid
          item
          md={4.8}
          sx={{
            backgroundColor: "#0c2340",
            color: "white",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            p: 4,
            height: "100%",
          }}
        >
          <Box sx={{ mb: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <SchoolIcon sx={{ color: "white", fontSize: 60, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              ENTS
            </Typography>
            <Typography variant="subtitle1" sx={{ fontStyle: "italic", mt: 1 }}>
              Education Management System
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Welcome Back!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: "80%" }}>
            Manage your school administration with ease using ENTS.
          </Typography>

          <Button
            variant="outlined"
            component={RouterLink}
            to="/signup"
            sx={{
              color: "white",
              borderColor: "white",
              borderRadius: 30,
              px: 4,
              py: 1.2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "white",
              },
            }}
          >
            Create an Account
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginForm;
