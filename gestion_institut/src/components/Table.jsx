import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TableSortLabel,
  Button,
  TablePagination,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  alpha,
  Tooltip,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const GenericTable = ({
  columns = [],         
  rows = [],  
  order,
  orderBy,
  onRequestSort,
  onAdd,
  iconOnAdd,
  refOnAdd,
  showActions = true,
  showAddButton = true,
  pagination = false,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  actions = [],
  onRowClick = null,
  rowStyle = {},
  headerColor = "#0c2340",
  alternateRowColors = true,
  tableTitle,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [hoveredRow, setHoveredRow] = React.useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Create status color mapping for consistent styling
  const statusColors = {
    "Validé": "#2e7d32",
    "Non Validé": "#d32f2f",
    "En attente": "#ed6c02",
  };

  return (
    <Box sx={{ 
      width: "100%", 
      borderRadius: 1,
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}>
      {tableTitle && (
        <Box sx={{ 
          p: 2, 
          backgroundColor: alpha(headerColor, 0.05),
          borderBottom: `1px solid ${alpha(headerColor, 0.2)}`
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: headerColor }}>
            {tableTitle}
          </Typography>
        </Box>
      )}
      
      <TableContainer component={Paper} sx={{ width: "100%", boxShadow: "none" }}>
        <Table sx={{ minWidth: isSmallScreen ? "unset" : 650, width: "100%" }}>
          <TableHead sx={{ backgroundColor: headerColor }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    color: "#ffffff",
                    fontWeight: 600,
                    padding: isSmallScreen ? "10px 6px" : "14px 16px",
                    display: isSmallScreen && column.hideOnMobile ? "none" : "table-cell",
                    fontSize: "0.875rem",
                    letterSpacing: "0.02em",
                    borderBottom: `2px solid ${alpha(headerColor, 0.8)}`,
                  }}
                >
                  {pagination ? (
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? order : "asc"}
                      onClick={() => onRequestSort(column.key)}
                      sx={{
                        color: "#ffffff !important",
                        "&:hover": { color: "#ffffff" },
                        "&.Mui-active": { color: "#ffffff" },
                        "& .MuiTableSortLabel-icon": { color: "#ffffff !important" },
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {(showActions || showAddButton) && (
                <TableCell align="right" sx={{ 
                  padding: isSmallScreen ? "10px 6px" : "12px 16px",
                  color: "#ffffff"
                }}>
                  {showAddButton && (
                    <Tooltip 
                      title="Ajouter" 
                      placement="top"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                      <Button
                        sx={{ 
                          minWidth: "unset", 
                          p: 0.5, 
                          borderRadius: "50%", 
                          backgroundColor: alpha("#ffffff", 0.12),
                          "&:hover": {
                            backgroundColor: alpha("#ffffff", 0.25)
                          }
                        }}
                        onClick={onAdd}
                        ref={refOnAdd}
                        aria-label="Add"
                        id="composition-button"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        {iconOnAdd || 
                          <AddIcon
                            sx={{
                              color: "#ffffff",
                              fontSize: isHovered ? "24px" : "22px",
                              transition: "all 0.3s ease",
                            }}
                          />
                        }
                      </Button>
                    </Tooltip>
                  )}
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex} 
                  hover
                  onClick={() => onRowClick && onRowClick(row)}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  sx={{ 
                    ...rowStyle,
                    cursor: onRowClick ? 'pointer' : 'default',
                    backgroundColor: alternateRowColors ? 
                      rowIndex % 2 === 0 ? 'white' : alpha(headerColor, 0.02) : 
                      'white',
                    "&:hover": {
                      backgroundColor: alpha(headerColor, 0.05),
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {columns.map((column) => {
                    const cellValue = row[column.key];
                    const isStatus = statusColors[cellValue] !== undefined;
                    
                    return (
                      <TableCell
                        key={column.key}
                        sx={{
                          padding: isSmallScreen ? "8px 6px" : "12px 16px",
                          color: isStatus ? statusColors[cellValue] : "inherit",
                          fontWeight: isStatus ? 500 : 400,
                          fontSize: "0.875rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: isSmallScreen && column.hideOnMobile ? "none" : "table-cell",
                          borderBottom: `1px solid ${alpha(headerColor, 0.1)}`,
                        }}
                      >
                        {isStatus ? (
                          <Box sx={{ 
                            display: "inline-flex", 
                            alignItems: "center",
                            backgroundColor: alpha(statusColors[cellValue], 0.12),
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: "0.75rem"
                          }}>
                            {cellValue}
                          </Box>
                        ) : (
                          cellValue
                        )}
                      </TableCell>
                    );
                  })}
                  {showActions && actions.length > 0 && (
                    <TableCell align="right" sx={{ 
                      padding: isSmallScreen ? "6px" : "8px",
                      borderBottom: `1px solid ${alpha(headerColor, 0.1)}`,
                    }}>
                      <Box sx={{ 
                        opacity: hoveredRow === rowIndex ? 1 : 0.5,
                        transition: "opacity 0.2s ease",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 0.5
                      }}>
                        {actions.map((action, index) => (
                          <Tooltip 
                            key={index}
                            title={action.label || ""}
                            placement="top"
                            arrow
                          >
                            <IconButton
                              aria-label={action.label}
                              onClick={(e) => {
                                if (action.stopPropagation) {
                                  e.stopPropagation();
                                }
                                action.onClick(row);
                              }}
                              color={action.color || "default"}
                              size={isSmallScreen ? "small" : "medium"}
                              sx={{
                                color: action.color === "error" ? theme.palette.error.main : 
                                      action.color === "primary" ? theme.palette.primary.main :
                                      action.color === "success" ? theme.palette.success.main : 
                                      "inherit",
                                "&:hover": {
                                  backgroundColor: alpha(
                                    action.color === "error" ? theme.palette.error.main : 
                                    action.color === "primary" ? theme.palette.primary.main :
                                    action.color === "success" ? theme.palette.success.main : 
                                    theme.palette.action.active,
                                    0.1
                                  )
                                }
                              }}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (showActions ? 1 : 0)} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, opacity: 0.7 }}>
                    <Typography variant="body1" color="textSecondary">
                      Aucun enregistrement trouvé.
                    </Typography>
                    {showAddButton && (
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={onAdd}
                        startIcon={<AddIcon />}
                        sx={{ mt: 1 }}
                      >
                        Ajouter un élément
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {pagination && (
          <TablePagination
            rowsPerPageOptions={isSmallScreen ? [5, 10] : [5, 10, 25, 50]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            labelRowsPerPage={isSmallScreen ? "Lignes:" : "Lignes par page:"}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`}
            sx={{
              "& .MuiTablePagination-toolbar": {
                flexWrap: isSmallScreen ? "wrap" : "nowrap",
                padding: isSmallScreen ? "4px 8px" : "8px 16px",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                margin: 0,
              },
              borderTop: `1px solid ${alpha(headerColor, 0.1)}`,
            }}
          />
        )}
      </TableContainer>
    </Box>
  );
};

export default GenericTable;