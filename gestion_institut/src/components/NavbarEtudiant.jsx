
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  styled,
  DialogContentText,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Close as CloseIcon,
  KeyboardArrowDown,
  Notifications,
  Message,
  Logout,
} from "@mui/icons-material";

// CORRECTION: AppBAr → AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#0c2340",
  boxShadow: theme.shadows[4],
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const AnimatedMenuIcon = styled(IconButton)(({ theme }) => ({
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}));

const NavbarEtudiant = ({ onMenuToggle, isMenuOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [anchorMsg, setAnchorMsg] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const user = { username: "Etudiant X" };
  const organizationName = "ENT ESTS";

  const notifications = [
    { label: "Nouveau cours", secondary: "il y a 3 min" },
    { label: "Nouveau Note ajouter", secondary: "il y a 3 min" },
  ];

  const messages = [
    { label: "Message de prof Imad", secondary: "il y a 2h" },
    { label: "Message de étudiant Imad", secondary: "il y a 2h" },
  ];

  const handleMenuOpen = (setter) => (e) => setter(e.currentTarget);
  const handleMenuClose = (setter) => () => setter(null);

  const handleLogout = () => {
    handleMenuClose(setAnchorEl)();
    setLogoutDialogOpen(true);
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Gauche : hamburger + titre */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <AnimatedMenuIcon onClick={onMenuToggle} size="large" sx={{ color: "white" }}>
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </AnimatedMenuIcon>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
              {organizationName}
            </Typography>
          </Stack>

          {/* Droite : messages, notifications, profil */}
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Messages */}
            <IconButton onClick={handleMenuOpen(setAnchorMsg)} sx={{ color: "white" }}>
              <Badge badgeContent={messages.length} color="error">
                <Message />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorMsg}
              open={Boolean(anchorMsg)}
              onClose={handleMenuClose(setAnchorMsg)}
              PaperProps={{ sx: { minWidth: 300 } }}
            >
              {messages.map((msg, i) => (
                <MenuItem key={i} dense>
                  <ListItemText
                    primary={msg.label}
                    secondary={msg.secondary}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </MenuItem>
              ))}
            </Menu>

            {/* Notifications */}
            <IconButton onClick={handleMenuOpen(setAnchorNotif)} sx={{ color: "white" }}>
              <Badge badgeContent={notifications.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorNotif}
              open={Boolean(anchorNotif)}
              onClose={handleMenuClose(setAnchorNotif)}
              PaperProps={{ sx: { minWidth: 300 } }}
            >
              {notifications.map((notif, i) => (
                <MenuItem key={i} dense>
                  <ListItemText
                    primary={notif.label}
                    secondary={notif.secondary}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </MenuItem>
              ))}
            </Menu>

            {/* Profil */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              onClick={handleMenuOpen(setAnchorEl)}
              sx={{
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#0c2340",
                  width: 34,
                  height: 34,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {user.username.charAt(0)}
              </Avatar>
              <Typography variant="subtitle1" sx={{ color: "white" }}>
                {user.username}
              </Typography>
              <KeyboardArrowDown sx={{ color: "white" }} />
            </Stack>

            {/* Menu Profil */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose(setAnchorEl)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem>
                <ListItemText primary="Mon Profil" />
              </MenuItem>
              <MenuItem>
                <ListItemText primary="Paramètres" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Déconnexion" />
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </StyledAppBar>

      {/* Dialog de déconnexion */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmation de déconnexion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir vous déconnecter ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/logout")}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavbarEtudiant;
