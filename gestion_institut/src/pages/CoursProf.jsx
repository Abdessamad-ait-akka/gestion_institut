import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  TextField,
  Box,
  Paper,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

// Styles personnalisés
const GradientPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: '#1E3A8A',
  fontWeight: 600,
  textAlign: 'center',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    '& fieldset': {
      borderColor: '#E2E8F0',
    },
    '&:hover fieldset': {
      borderColor: '#3B82F6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1E3A8A',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    },
  },
}));

const FileInputLabel = styled(InputLabel)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: '#4A5568',
  fontWeight: 500,
}));

const FileInput = styled('input')(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: 8,
  border: '1px dashed #CBD5E0',
  backgroundColor: '#F8FAFC',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  '&:focus': {
    outline: 'none',
    borderColor: '#1E3A8A',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1E3A8A 0%, #3B82F6 100%)',
  borderRadius: 8,
  color: 'white',
  height: 48,
  padding: '0 30px',
  marginTop: theme.spacing(3),
  fontWeight: 600,
  letterSpacing: '0.5px',
  textTransform: 'none',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
    background: 'linear-gradient(45deg, #1E3A8A 0%, #3B82F6 90%)',
  },
  '&:disabled': {
    background: '#CBD5E0',
    color: '#64748B',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    animation: `${fadeIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)`,
    maxWidth: '450px',
  },
}));

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  backgroundColor: '#F8FAFC',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
}));

const SuccessContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4, 3),
  textAlign: 'center',
}));

const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: 72,
  color: '#10B981',
  marginBottom: theme.spacing(3),
  animation: `${scaleIn} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both`,
  filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))',
}));

const DialogActionsStyled = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  justifyContent: 'center',
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#10B981',
  color: 'white',
  borderRadius: 8,
  fontWeight: 600,
  letterSpacing: '0.5px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#0D9F6E',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(13, 159, 110, 0.3)',
  },
}));

const CoursProf = () => {
  const [titre, setTitre] = useState('');
  const [fichier, setFichier] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!fichier || fichier.type !== 'application/pdf') {
      alert('Veuillez sélectionner un fichier PDF valide');
      setIsSubmitting(false);
      return;
    }

    // Simule un envoi
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setOpenDialog(true);
    setIsSubmitting(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTitre('');
    setFichier(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Container maxWidth="sm" sx={{ my: 8 }}>
      <GradientPaper elevation={3}>
        <Title variant="h5">Uploader un Cours</Title>

        <Box component="form" onSubmit={handleSubmit}>
          <StyledTextField
            label="Titre du cours"
            variant="outlined"
            fullWidth
            required
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />

          <FileInputLabel htmlFor="file-input">Fichier (PDF)</FileInputLabel>
          <FileInput
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={(e) => setFichier(e.target.files[0])}
            required
            ref={fileInputRef}
          />

          <GradientButton type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Envoi en cours...' : 'Uploader'}
          </GradientButton>
        </Box>
      </GradientPaper>

      <StyledDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitleStyled>
          <Typography variant="h6" fontWeight="600">
            Confirmation d'upload
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small" aria-label="fermer">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitleStyled>

        <SuccessContent>
          <SuccessIcon />
          <Typography variant="h5" gutterBottom fontWeight="700">
            Upload réussi !
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Le cours <strong>"{titre}"</strong> a été enregistré avec succès.
          </Typography>
        </SuccessContent>

        <DialogActionsStyled>
          <PrimaryButton onClick={handleCloseDialog} startIcon={<CheckCircleIcon />}>
            Confirmer
          </PrimaryButton>
        </DialogActionsStyled>
      </StyledDialog>
    </Container>
  );
};

export default CoursProf;
