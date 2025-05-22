import React, { useState, useCallback, useMemo } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  LibraryBooks as CoursesIcon,
  Chat as MessagingIcon,
  Grade as GradesIcon,
  Assignment as InterventionIcon,
  HelpOutline as AssistanceIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

const getEtudiantMenuItems = () => [
  {
    text: "Tableau de bord",
    icon: <DashboardIcon fontSize="small" />,
    path: "/etudiant",
  },
  {
    text: "Calendrier",
    icon: <CalendarIcon fontSize="small" />,
    path: "/calendrier",
  },
  {
    text: "Cours",
    icon: <CoursesIcon fontSize="small" />,
    path: "/cours",
  },
  {
    text: "Messagerie",
    icon: <MessagingIcon fontSize="small" />,
    path: "/messagerie",
  },
  {
    text: "Notes",
    icon: <GradesIcon fontSize="small" />,
    path: "/notes",
  },
  {
    text: "Intervention",
    icon: <InterventionIcon fontSize="small" />,
    path: "/intervention",
  },
  {
    text: "Assistance",
    icon: <AssistanceIcon fontSize="small" />,
    path: "/assistance",
  },

];

const SidebarEtudiant = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedItems, setExpandedItems] = useState({});
  const menuItems = useMemo(() => getEtudiantMenuItems(), []);

  const toggleExpanded = useCallback((text, e) => {
    e.stopPropagation();
    setExpandedItems((prev) => ({ ...prev, [text]: !prev[text] }));
  }, []);

  const handleClick = useCallback(
    (path) => {
      if (!path) return;
      navigate(path);
      if (isMobile) onToggle();
    },
    [navigate, isMobile, onToggle]
  );

  const renderItem = (item) => {
    const hasChildren = !!item.children;
    const isExpanded = expandedItems[item.text];
    return (
      <div key={item.text}>
        <ListItemButton
          onClick={(e) =>
            hasChildren ? toggleExpanded(item.text, e) : handleClick(item.path)
          }
          sx={{ color: "white", "&:hover": { backgroundColor: "#1b3c56" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
          {hasChildren &&
            (isExpanded ? (
              <ExpandLess sx={{ color: "white" }} />
            ) : (
              <ExpandMore sx={{ color: "white" }} />
            ))}
        </ListItemButton>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              {item.children.map((subItem) => (
                <ListItemButton
                  key={subItem.text}
                  onClick={() => handleClick(subItem.path)}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "#1b3c56" },
                  }}
                >
                  <ListItemIcon sx={{ color: "white" }}>
                    {subItem.icon}
                  </ListItemIcon>
                  <ListItemText primary={subItem.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={isOpen}
      onClose={onToggle}
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: "#0c2340",
          color: "white",
          width: 260,
          borderRight: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      }}
    >
      <Toolbar />
      <List>{menuItems.map(renderItem)}</List>
    </Drawer>
  );
};

export default SidebarEtudiant;
