"use client"

import { useState, useRef } from "react"
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import CloseIcon from "@mui/icons-material/Close"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import SchoolIcon from "@mui/icons-material/School"
import GroupsIcon from "@mui/icons-material/Groups"
import CategoryIcon from "@mui/icons-material/Category"

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const scaleIn = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

// Styles personnalisés
const GradientPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #ffffff, #f5f7fa)",
  animation: `${fadeIn} 0.5s ease-out`,
}))

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: "#1E3A8A",
  fontWeight: 600,
  textAlign: "center",
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    "& fieldset": {
      borderColor: "#E2E8F0",
    },
    "&:hover fieldset": {
      borderColor: "#3B82F6",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1E3A8A",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)",
    },
  },
}))

const FileInputLabel = styled(InputLabel)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: "#4A5568",
  fontWeight: 500,
}))

const FileInput = styled("input")(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: 8,
  border: "1px dashed #CBD5E0",
  backgroundColor: "#F8FAFC",
  transition: "all 0.2s",
  "&:hover": {
    borderColor: "#3B82F6",
    backgroundColor: "#EBF4FF",
  },
  "&:focus": {
    outline: "none",
    borderColor: "#1E3A8A",
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)",
  },
}))

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #1E3A8A 0%, #3B82F6 100%)",
  borderRadius: 8,
  color: "white",
  height: 48,
  padding: "0 30px",
  marginTop: theme.spacing(3),
  fontWeight: 600,
  letterSpacing: "0.5px",
  textTransform: "none",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
    background: "linear-gradient(45deg, #1E3A8A 0%, #3B82F6 90%)",
  },
  "&:disabled": {
    background: "#CBD5E0",
    color: "#64748B",
  },
}))

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    animation: `${fadeIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)`,
    maxWidth: "450px",
  },
}))

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 3),
  backgroundColor: "#F8FAFC",
  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
}))

const SuccessContent = styled(DialogContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4, 3),
  textAlign: "center",
}))

const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: 72,
  color: "#10B981",
  marginBottom: theme.spacing(3),
  animation: `${scaleIn} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both`,
  filter: "drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))",
}))

const DialogActionsStyled = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
  justifyContent: "center",
}))

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#10B981",
  color: "white",
  borderRadius: 8,
  fontWeight: 600,
  letterSpacing: "0.5px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#0D9F6E",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(13, 159, 110, 0.3)",
  },
}))

const ActionButton = styled(IconButton)(({ theme, color }) => ({
  color: color === "edit" ? "#3B82F6" : color === "delete" ? "#EF4444" : "#10B981",
  backgroundColor:
    color === "edit"
      ? "rgba(59, 130, 246, 0.1)"
      : color === "delete"
        ? "rgba(239, 68, 68, 0.1)"
        : "rgba(16, 185, 129, 0.1)",
  marginRight: theme.spacing(1),
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor:
      color === "edit"
        ? "rgba(59, 130, 246, 0.2)"
        : color === "delete"
          ? "rgba(239, 68, 68, 0.2)"
          : "rgba(16, 185, 129, 0.2)",
    transform: "scale(1.1)",
  },
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  animation: `${fadeIn} 0.6s ease-out`,
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  "&:hover": {
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
  transition: "background-color 0.2s",
}))

const StatusChip = styled(Chip)(({ theme, chipcolor }) => ({
  backgroundColor: chipcolor === "groupe" ? "rgba(59, 130, 246, 0.1)" : "rgba(16, 185, 129, 0.1)",
  color: chipcolor === "groupe" ? "#3B82F6" : "#10B981",
  fontWeight: 500,
  "& .MuiChip-icon": {
    color: "inherit",
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(3),
  color: "#1E3A8A",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  "& svg": {
    marginRight: theme.spacing(1),
    color: "#3B82F6",
  },
}))

const ConfirmDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
}))

const CoursProf = () => {
  const [titre, setTitre] = useState("")
  const [groupe, setGroupe] = useState("")
  const [filiere, setFiliere] = useState("")
  const [fichier, setFichier] = useState(null)
  const [existingFileName, setExistingFileName] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courses, setCourses] = useState([])
  const [editingCourseId, setEditingCourseId] = useState(null)
  const fileInputRef = useRef(null)

  // Données de démonstration pour les groupes et filières
  const groupes = ["Groupe A", "Groupe B", "Groupe C", "Groupe D"]
  const filieres = ["Informatique", "Mathématiques", "Physique", "Chimie", "Biologie"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (!titre || !groupe || !filiere) {
      alert("Veuillez remplir tous les champs obligatoires")
      setIsSubmitting(false)
      return
    }

    // Validation du fichier (seulement pour la création ou si un nouveau fichier est sélectionné)
    if (!editingCourseId) {
      // Création - fichier obligatoire
      if (!fichier || fichier.type !== "application/pdf") {
        alert("Veuillez sélectionner un fichier PDF valide")
        setIsSubmitting(false)
        return
      }
    } else {
      // Édition - si un fichier est sélectionné, vérifier qu'il est valide
      if (fichier && fichier.type !== "application/pdf") {
        alert("Veuillez sélectionner un fichier PDF valide")
        setIsSubmitting(false)
        return
      }
    }

    // Simule un envoi
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Création ou mise à jour du cours
    const newCourse = {
      id: editingCourseId || Date.now(),
      titre,
      groupe,
      filiere,
      fichier: fichier ? fichier.name : existingFileName,
      date: new Date().toLocaleDateString(),
    }

    if (editingCourseId) {
      // Mise à jour
      setCourses(courses.map((course) => (course.id === editingCourseId ? newCourse : course)))
    } else {
      // Création
      setCourses([...courses, newCourse])
    }

    setOpenDialog(true)
    setIsSubmitting(false)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    resetForm()
  }

  const resetForm = () => {
    setTitre("")
    setGroupe("")
    setFiliere("")
    setFichier(null)
    setExistingFileName("")
    setEditingCourseId(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleEdit = (course) => {
    setTitre(course.titre)
    setGroupe(course.groupe)
    setFiliere(course.filiere)
    setExistingFileName(course.fichier)
    setEditingCourseId(course.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDeleteConfirm = (course) => {
    setCourseToDelete(course)
    setOpenConfirmDialog(true)
  }

  const handleDelete = () => {
    setCourses(courses.filter((course) => course.id !== courseToDelete.id))
    setOpenConfirmDialog(false)
    setCourseToDelete(null)
  }

  return (
    <Container maxWidth="md" sx={{ my: 8 }}>
      <GradientPaper elevation={3}>
        <Title variant="h5">{editingCourseId ? "Modifier un Cours" : "Ajouter un Nouveau Cours"}</Title>

        <Box component="form" onSubmit={handleSubmit}>
          <StyledTextField
            label="Titre du cours"
            variant="outlined"
            fullWidth
            required
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />

          <StyledTextField
            select
            label="Groupe"
            variant="outlined"
            fullWidth
            required
            value={groupe}
            onChange={(e) => setGroupe(e.target.value)}
          >
            {groupes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledTextField>

          <StyledTextField
            select
            label="Filière"
            variant="outlined"
            fullWidth
            required
            value={filiere}
            onChange={(e) => setFiliere(e.target.value)}
          >
            {filieres.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledTextField>

          <FileInputLabel htmlFor="file-input">
            Fichier (PDF) {editingCourseId && "(Optionnel pour la modification)"}
          </FileInputLabel>
          <FileInput
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={(e) => setFichier(e.target.files[0])}
            required={!editingCourseId}
            ref={fileInputRef}
          />

          {fichier ? (
            <Typography variant="body2" sx={{ mt: -2, mb: 2, color: "green" }}>
              Fichier sélectionné : {fichier.name}
            </Typography>
          ) : existingFileName ? (
            <Typography variant="body2" sx={{ mt: -2, mb: 2, color: "text.secondary" }}>
              Fichier actuel : {existingFileName}
            </Typography>
          ) : null}

          <Box sx={{ display: "flex", gap: 2 }}>
            <GradientButton type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Traitement en cours..." : editingCourseId ? "Mettre à jour" : "Ajouter"}
            </GradientButton>

            {editingCourseId && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={resetForm}
                sx={{
                  height: 48,
                  borderRadius: 8,
                  marginTop: 3,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Annuler
              </Button>
            )}
          </Box>
        </Box>
      </GradientPaper>

      <SectionTitle variant="h5">
        <SchoolIcon /> Liste des Cours
      </SectionTitle>

      {courses.length > 0 ? (
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Titre</StyledTableCell>
                <StyledTableCell>Groupe</StyledTableCell>
                <StyledTableCell>Filière</StyledTableCell>
                <StyledTableCell>Fichier</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <StyledTableRow key={course.id}>
                  <StyledTableCell>{course.titre}</StyledTableCell>
                  <StyledTableCell>
                    <StatusChip icon={<GroupsIcon />} label={course.groupe} chipcolor="groupe" size="small" />
                  </StyledTableCell>
                  <StyledTableCell>
                    <StatusChip icon={<CategoryIcon />} label={course.filiere} chipcolor="filiere" size="small" />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {course.fichier}
                      <Tooltip title="Télécharger">
                        <IconButton size="small" sx={{ ml: 1, color: "#3B82F6" }}>
                          <FileDownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>{course.date}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Box>
                      <Tooltip title="Modifier">
                        <ActionButton size="small" color="edit" onClick={() => handleEdit(course)}>
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <ActionButton size="small" color="delete" onClick={() => handleDeleteConfirm(course)}>
                          <DeleteIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      ) : (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            border: "1px dashed #3B82F6",
          }}
        >
          <Typography color="text.secondary">
            Aucun cours n'a été ajouté. Utilisez le formulaire ci-dessus pour ajouter votre premier cours.
          </Typography>
        </Paper>
      )}

      {/* Dialog de confirmation de succès */}
      <StyledDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitleStyled>
          <Typography variant="h6" fontWeight="600">
            Confirmation
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small" aria-label="fermer">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitleStyled>

        <SuccessContent>
          <SuccessIcon />
          <Typography variant="h5" gutterBottom fontWeight="700">
            {editingCourseId ? "Cours mis à jour !" : "Cours ajouté !"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Le cours <strong>"{titre}"</strong> a été {editingCourseId ? "mis à jour" : "ajouté"} avec succès.
          </Typography>
        </SuccessContent>

        <DialogActionsStyled>
          <PrimaryButton onClick={handleCloseDialog} startIcon={<CheckCircleIcon />}>
            Confirmer
          </PrimaryButton>
        </DialogActionsStyled>
      </StyledDialog>

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitleStyled>
          <Typography variant="h6" fontWeight="600">
            Confirmer la suppression
          </Typography>
          <IconButton onClick={() => setOpenConfirmDialog(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitleStyled>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Êtes-vous sûr de vouloir supprimer le cours <strong>{courseToDelete?.titre}</strong> ?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActionsStyled>
          <Button
            variant="outlined"
            onClick={() => setOpenConfirmDialog(false)}
            sx={{ borderRadius: 8, textTransform: "none" }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{
              borderRadius: 8,
              textTransform: "none",
              ml: 2,
              backgroundColor: "#EF4444",
              "&:hover": {
                backgroundColor: "#DC2626",
              },
            }}
          >
            Supprimer
          </Button>
        </DialogActionsStyled>
      </ConfirmDialog>
    </Container>
  )
}

export default CoursProf
