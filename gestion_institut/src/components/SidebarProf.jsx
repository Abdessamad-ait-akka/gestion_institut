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
  Dashboard,
  ExpandLess,
  ExpandMore,
  Class as ClassIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

const getProfMenuItems = () => [
  {
    text: "Acceuil",
    icon: <Dashboard />,
    path: "/prof",
  },
  {
    text: "Cours",
    icon: <ClassIcon />,
    path: "/coursProf",
  },
  {
    text: "Notes",
    icon: <AssessmentIcon />,
    path: "/notes",
  },
  {
    text: "Devoirs",
    icon: <AssessmentIcon />,
    path: "/devoirProf",
  },
];

const SidebarProf = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedItems, setExpandedItems] = useState({});
  const menuItems = useMemo(() => getProfMenuItems(), []);

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

export default SidebarProf;
