import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { PiStudentBold } from 'react-icons/pi';
import { GiTeacher } from 'react-icons/gi';
import { IoIosPeople } from 'react-icons/io';
import DashboardCard from '../components/DashboardCard';

const AdminPanel = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dashboardItems = [
    {
      icon: <PiStudentBold size={24} />,
      title: "Étudiants",
      description: "Gérer les étudiants inscrits",
      path: '/etudiantDashboard',
      color: theme.palette.primary.main
    },
    {
      icon: <GiTeacher size={24} />,
      title: "Enseignants",
      description: "Gérer le corps professoral",
      path: '/profDashboard',
      color: theme.palette.secondary.main
    },
    {
      icon: <IoIosPeople size={24} />,
      title: "Utilisateurs",
      description: "Gérer les comptes utilisateurs",
      path: '/users',
      color: theme.palette.success.main
    }
  ];

  return (
    <Box sx={{
      p: 4,
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{
        mb: 5,
        fontWeight: 600,
        color: theme.palette.text.primary
      }}>
        {/*titre*/}
      </Typography>

      <Grid container spacing={3} justifyContent={isMobile ? 'center' : 'flex-start'}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DashboardCard
              icon={item.icon}
              title={item.title}
              description={item.description}
              onClick={() => navigate(item.path)}
              color={item.color}
              sx={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminPanel;