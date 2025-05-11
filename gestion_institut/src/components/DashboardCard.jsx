import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const DashboardCard = ({ icon, title, description, onClick, iconColor, cardColor }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const hoverEffect = {
    y: -5,
    boxShadow: theme.shadows[6],
    transition: { duration: 0.3 }
  };

  return (
    <motion.div
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
    >
      <Paper
        sx={{
          minWidth: 240,
          maxWidth: 280,
          p: 3,
          borderRadius: 2,
          bgcolor: cardColor || theme.palette.background.paper,
          cursor: 'pointer',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            boxShadow: theme.shadows[6]
          }
        }}
        elevation={2}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box
            component={motion.div}
            sx={{
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: iconColor || theme.palette.primary.main,
              color: theme.palette.common.white,
              fontSize: 34
            }}
            whileHover={{ scale: 1.05 }}
          >
            {icon}
          </Box>

          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 0.5
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              textAlign: 'center',
              lineHeight: 1.5,
              fontSize: isMobile ? '0.875rem' : '0.9375rem'
            }}
          >
            {description}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

DashboardCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  iconColor: PropTypes.string,
  cardColor: PropTypes.string
};

export default DashboardCard;