import React, { useState, useCallback, useMemo } from "react";
import { useTheme, useMediaQuery, Toolbar } from "@mui/material";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Dashboard,
  Class as ClassIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const getMenuItems = (role) => {
  const commonItems = [
    { text: "Dashboard", icon: <Dashboard />, path: role === "SYSTEM_ADMIN" ? "/admin" : "/admin" },
  ];

  if (role === "SYSTEM_ADMIN") {
    return [
      ...commonItems,
      {
        text: "Admin",
        icon: <AdminPanelSettingsIcon />,
         path: "/admin",
     
      },
      {
        text: "Organisation",
        icon: <AdminPanelSettingsIcon />,
        path: "/organisations",
      
      },
      { text: "Paramètres", icon: <SettingsIcon /> },
    ];
  }

  return [
    ...commonItems,
 
    {
      text: "Profils Enseignants",
      icon: <PersonIcon />,
      path: "/profDashboard",
    },
    {
      text: "Profils Élèves",
      path: "/etudiantDashboard",
      icon: <PersonIcon />,
    },
  
  ];
};

const Sidebar = React.memo(({ isOpen, onToggle, role }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();
  
  const menuItems = useMemo(() => getMenuItems(role), [role]);

  const toggleExpanded = useCallback((itemText, event) => {
    event.stopPropagation();
    setExpandedItems(prev => ({ ...prev, [itemText]: !prev[itemText] }));
  }, []);

  const handleMenuClick = useCallback((path) => {
    if (!path) return;
    navigate(path);
    if (isMobile) onToggle();
  }, [navigate, isMobile, onToggle]);

  const renderMenuItem = useCallback((item) => {
    const hasChildren = item.children?.length > 0;
    const isExpanded = expandedItems[item.text];
  
    return (
      <div key={item.text}>
        <ListItemButton
          onClick={(e) => {
            if (hasChildren) {
              toggleExpanded(item.text, e);
            } else {
              handleMenuClick(item.path);
            }
          }}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "#1b3c56",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{
              "&:hover": {
                color: "gold",
              },
            }}
          />
          {hasChildren && (
            <IconButton
              edge="end"
              onClick={(e) => toggleExpanded(item.text, e)}
              sx={{ color: "white" }}
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </ListItemButton>
  
        {hasChildren && (
          <Collapse in={isExpanded}>
            <List component="div" disablePadding>
              {item.children.map(renderMenuItem)}
            </List>
          </Collapse>
        )}
      </div>
    );
  }, [expandedItems, handleMenuClick, toggleExpanded]);
  

  return (
  <Drawer
    variant={isMobile ? "temporary" : "persistent"}
    open={isOpen}
    onClose={onToggle}
    sx={{
      display: "block", // toujours afficher le Drawer, c'est sa variante qui change
      "& .MuiDrawer-paper": {
        backgroundColor: "#0c2340",
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      },
    }}
  >

      <Toolbar />
      <List component="nav">
        {menuItems.map(renderMenuItem)}
      </List>
    </Drawer>
  );
});

export default Sidebar;