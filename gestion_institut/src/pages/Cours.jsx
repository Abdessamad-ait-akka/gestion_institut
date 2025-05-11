import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Description as FileIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const mockCours = [
  {
    id: 1,
    titre: 'React Native',
    description: 'Introduction aux fondamentaux de React Native',
    fichier: '/fichiers/react.pdf',
    datePublication: '2024-03-15',
    professeur: 'Dr. Ahmed Benali'
  },
  {
    id: 2,
    titre: 'Laravel Avancé',
    description: 'Gestion des routes et middleware',
    fichier: '/fichiers/laravel.pdf',
    datePublication: '2024-03-18',
    professeur: 'Prof. Fatima Zohra'
  },
];

const CourseCard = ({ course, onUploadClick }) => {
  const theme = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `4px solid ${theme.palette.primary.main}`
      }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="h3" gutterBottom>
              {course.titre}
            </Typography>
            <Tooltip title="Date de publication">
              <Typography variant="caption" color="text.secondary">
                {new Date(course.datePublication).toLocaleDateString()}
              </Typography>
            </Tooltip>
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            {course.description}
          </Typography>

          <Typography variant="caption" color="text.disabled">
            Enseignant: {course.professeur}
          </Typography>
        </CardContent>

        <Box sx={{ p: 2, bgcolor: theme.palette.background.default }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<DownloadIcon />}
                href={course.fichier}
                download
              >
                Télécharger
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<UploadIcon />}
                onClick={() => onUploadClick(course)}
              >
                Déposer devoir
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </motion.div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
  onUploadClick: PropTypes.func.isRequired
};

export default function Cours() {
  const theme = useTheme();
  const [cours, setCours] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [fichier, setFichier] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setCours(mockCours);
      } catch (err) {
        setError('Erreur de chargement des cours');
      }
    };
    
    fetchCours();
  }, []);

  const handleUpload = async () => {
    if (!fichier) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Fichier envoyé:', fichier);
      setOpenDialog(false);
      setFichier(null);
    } catch (err) {
      setError("Échec de l'envoi du fichier");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom>
          
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          
        </Typography>
      </Box>

      {error && (
        <Box mb={3} textAlign="center">
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {cours.length > 0 ? (
          cours.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course.id}>
              <CourseCard 
                course={course} 
                onUploadClick={(c) => {
                  setSelectedCours(c);
                  setOpenDialog(true);
                }}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={() => !isSubmitting && setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          Dépôt de devoir
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => !isSubmitting && setOpenDialog(false)}
            disabled={isSubmitting}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 4 }}>
          <Box textAlign="center">
            <input
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={(e) => setFichier(e.target.files[0])}
              disabled={isSubmitting}
            />
            <label htmlFor="file-upload">
              <Button
                component="span"
                variant="contained"
                color="primary"
                startIcon={<UploadIcon />}
                disabled={isSubmitting}
              >
                Sélectionner un fichier
              </Button>
            </label>

            {fichier && (
              <Box mt={3} display="flex" alignItems="center" justifyContent="center">
                <FileIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{fichier.name}</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!fichier || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}