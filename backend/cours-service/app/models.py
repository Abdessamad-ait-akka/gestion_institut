from app import db
from datetime import datetime
class Utilisateur(db.Model):
    __tablename__ = 'utilisateurs'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    mot_de_passe = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    etudiant = db.relationship('Etudiant', back_populates='utilisateur', uselist=False)
    enseignant = db.relationship('Enseignant', back_populates='utilisateur', uselist=False)

class Filiere(db.Model):
    __tablename__ = 'filiere'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)

    groupes = db.relationship('Groupe', backref='filiere', lazy=True)
    matieres = db.relationship('Matiere', backref='filiere', lazy=True)
    cours = db.relationship('Cours', backref='filiere', lazy=True)


class Groupe(db.Model):
    __tablename__ = 'groupe'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    filiere_id = db.Column(db.Integer, db.ForeignKey('filiere.id'), nullable=False)
    etudiants = db.relationship('Etudiant', back_populates='groupe')

    cours_groupes = db.relationship('CoursGroupes', back_populates='groupe')


class Etudiant(db.Model):
    __tablename__ = 'etudiants'
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id'), primary_key=True)
    id_groupe = db.Column(db.Integer, db.ForeignKey('groupe.id'))  # 🔧 Correction ici

    groupe = db.relationship('Groupe', back_populates='etudiants')
    utilisateur = db.relationship('Utilisateur', back_populates='etudiant')


class Enseignant(db.Model):
    __tablename__ = 'enseignants'
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id'), primary_key=True)

    utilisateur = db.relationship('Utilisateur', back_populates='enseignant')
    cours = db.relationship('Cours', back_populates='enseignant', lazy=True)
    matieres = db.relationship('Matiere', back_populates='enseignant', lazy=True)

class Matiere(db.Model):
    __tablename__ = 'matiere'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    id_filiere = db.Column(db.Integer, db.ForeignKey('filiere.id'), nullable=False)

    enseignant_id = db.Column(db.Integer, db.ForeignKey('enseignants.id_utilisateur'), nullable=True)

    cours = db.relationship('Cours', backref='matiere', lazy=True)
    enseignant = db.relationship('Enseignant', back_populates='matieres')

class Cours(db.Model):
    __tablename__ = 'cours'
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(255), nullable=False)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    fichier = db.Column(db.String(255), nullable=False)

    enseignant_id = db.Column(db.Integer, db.ForeignKey('enseignants.id_utilisateur'), nullable=False)
    filiere_id = db.Column(db.Integer, db.ForeignKey('filiere.id'), nullable=False)
    matiere_id = db.Column(db.Integer, db.ForeignKey('matiere.id'), nullable=True)

    cours_groupes = db.relationship('CoursGroupes', back_populates='cours', lazy=True)

    enseignant = db.relationship('Enseignant', back_populates='cours')
    
class CoursGroupes(db.Model):
    __tablename__ = 'cours_groupes'
    cours_id = db.Column(db.Integer, db.ForeignKey('cours.id'), primary_key=True)
    groupe_id = db.Column(db.Integer, db.ForeignKey('groupe.id'), primary_key=True)

    cours = db.relationship('Cours', back_populates='cours_groupes')
    groupe = db.relationship('Groupe', back_populates='cours_groupes')


   