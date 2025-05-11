import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import DashboardCard from '../components/DashboardCard';
import { MdEmail, MdGrade, MdCalendarMonth, MdBuild, MdComputer, MdHelp } from 'react-icons/md';

const EtudiantPanel = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const cards = [
    {
      icon: <MdEmail style={{ fontSize: '28px' }} />,
      title: "Messagerie",
      description: "Messagerie électronique des étudiants",
      path: '/messagerie'
    },
    {
      icon: <MdGrade style={{ fontSize: '28px' }} />,
      title: "Notes",
      description: "Consulter vos notes aux épreuves",
      path: '/notes'
    },
    {
      icon: <MdCalendarMonth style={{ fontSize: '28px' }} />,
      title: "Calendrier",
      description: "Votre calendrier académique",
      path: '/calendrier'
    },
    {
      icon: <MdBuild style={{ fontSize: '28px' }} />,
      title: "Demande d'intervention",
      description: "Assistance technique aux étudiants",
      path: '/intervention'
    },
    {
      icon: <MdComputer style={{ fontSize: '28px' }} />,
      title: "Cours en ligne",
      description: "Accéder à la plateforme pédagogique",
      path: '/cours'
    },
    {
      icon: <MdHelp style={{ fontSize: '28px' }} />,
      title: "Assistance ENT",
      description: "FAQ et support technique ENT",
      path: '/assistance'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" sx={{ 
          mb: 6, 
          fontWeight: 600,
          color: theme.palette.text.primary,
          textAlign: 'center'
        }}>
         
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {cards.map((card, index) => (
            <Grid 
              item 
              key={card.title}
              xs={12} 
              sm={6} 
              md={4} 
              lg={3}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                style={{ width: '100%', maxWidth: 320 }}
              >
                <DashboardCard
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  onClick={() => navigate(card.path)}
                  iconColor={theme.palette.primary.main}
                  cardColor={theme.palette.background.paper}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Typography variant="body2" sx={{
          mt: 8,
          textAlign: 'center',
          color: theme.palette.text.secondary,
          fontSize: '0.875rem'
        }}>
          Plateforme ENT - École Supérieure de Technologie et de Sciences © {new Date().getFullYear()}
        </Typography>
      </Container>
    </motion.div>
  );
};

export default EtudiantPanel;