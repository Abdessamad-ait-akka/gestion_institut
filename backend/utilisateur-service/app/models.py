from app import db

class Utilisateur(db.Model):
    __tablename__ = 'utilisateurs'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50))
    prenom = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    mot_de_passe = db.Column(db.String(255))
    role = db.Column(db.Enum('etudiant', 'enseignant', 'administrateur'), nullable=False)

    etudiant = db.relationship('Etudiant', back_populates='utilisateur', uselist=False)
    enseignant = db.relationship('Enseignant', back_populates='utilisateur', uselist=False)


class Etudiant(db.Model):
    __tablename__ = 'etudiants'
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id'), primary_key=True)
    id_groupe = db.Column(db.Integer, db.ForeignKey('groupe.id'), nullable=False)
    id_filiere = db.Column(db.Integer, db.ForeignKey('filiere.id'), nullable=False)

    utilisateur = db.relationship('Utilisateur', back_populates='etudiant')
    groupe = db.relationship('Groupe', back_populates='etudiants')
    filiere = db.relationship('Filiere', back_populates='etudiants')


class Enseignant(db.Model):
    __tablename__ = 'enseignants'
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id'), primary_key=True)

    utilisateur = db.relationship('Utilisateur', back_populates='enseignant')
    groupes = db.relationship('Groupe', secondary='enseignant_groupe', back_populates='enseignants')
    matieres = db.relationship('Matiere', secondary='enseignant_matiere', back_populates='enseignants')
    filieres = db.relationship('Filiere', secondary='enseignant_filiere', back_populates='enseignants')


class Groupe(db.Model):
    __tablename__ = 'groupe'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    filiere_id = db.Column(db.Integer, db.ForeignKey('filiere.id'), nullable=False)

    filiere = db.relationship('Filiere', back_populates='groupes')
    etudiants = db.relationship('Etudiant', back_populates='groupe')
    enseignants = db.relationship('Enseignant', secondary='enseignant_groupe', back_populates='groupes')
    matieres = db.relationship('Matiere', back_populates='groupe')


class Filiere(db.Model):
    __tablename__ = 'filiere'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(255))

    groupes = db.relationship('Groupe', back_populates='filiere')
    matieres = db.relationship('Matiere', back_populates='filiere')
    etudiants = db.relationship('Etudiant', back_populates='filiere')
    enseignants = db.relationship('Enseignant', secondary='enseignant_filiere', back_populates='filieres')


class Matiere(db.Model):
    __tablename__ = 'matiere'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    filiere_id = db.Column(db.Integer, db.ForeignKey('filiere.id'), nullable=False)
    groupe_id = db.Column(db.Integer, db.ForeignKey('groupe.id'), nullable=True)

    filiere = db.relationship('Filiere', back_populates='matieres')
    groupe = db.relationship('Groupe', back_populates='matieres')
    enseignants = db.relationship('Enseignant', secondary='enseignant_matiere', back_populates='matieres')


# Tables d'association

class EnseignantGroupe(db.Model):
    __tablename__ = 'enseignant_groupe'
    enseignant_id = db.Column(db.Integer, db.ForeignKey('enseignants.id_utilisateur'), primary_key=True)
    groupe_id = db.Column(db.Integer, db.ForeignKey('groupe.id'), primary_key=True)


class EnseignantMatiere(db.Model):
    __tablename__ = 'enseignant_matiere'
    enseignant_id = db.Column(db.Integer, db.ForeignKey('enseignants.id_utilisateur'), primary_key=True)
    matiere_id = db.Column(db.Integer, db.ForeignKey('matiere.id'), primary_key=True)


class EnseignantFiliere(db.Model):
    __tablename__ = 'enseignant_filiere'
    enseignant_id = db.Column(db.Integer, db.ForeignKey('enseignants.id_utilisateur'), primary_key=True)
    filiere_id = db.Column(db.Integer, db.ForeignKey('filiere.id'), primary_key=True)
