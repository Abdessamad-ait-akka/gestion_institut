from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash

db = SQLAlchemy()

class Utilisateur(db.Model):
    __tablename__ = 'utilisateurs'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mot_de_passe = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)

    def __init__(self, nom, prenom, email, mot_de_passe, role):
        self.nom = nom
        self.prenom = prenom
        self.email = email
        self.mot_de_passe = generate_password_hash(mot_de_passe)
        self.role = role

class Filiere(db.Model):
    __tablename__ = 'filiere'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)

class Matiere(db.Model):
    __tablename__ = 'matiere'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)

class Groupe(db.Model):
    __tablename__ = 'groupe'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    id_filiere = db.Column(db.Integer, db.ForeignKey('filiere.id'))

class Etudiant(db.Model):
    __tablename__ = 'etudiants'
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id'), primary_key=True)
    id_groupe = db.Column(db.Integer, db.ForeignKey('groupe.id'), nullable=False)
    id_filiere = db.Column(db.Integer, db.ForeignKey('filiere.id'), nullable=False)

class Enseignant(db.Model):
    __tablename__ = 'enseignants'
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id'), primary_key=True)

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
