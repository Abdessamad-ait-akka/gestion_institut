from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()

class Cours(db.Model):
    __tablename__ = 'cours'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    titre = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    date_creation = db.Column(db.DateTime, server_default=db.func.now())
    enseignant_id = db.Column(db.String(36), db.ForeignKey('enseignant.utilisateur_id'))

class Fichier(db.Model):
    __tablename__ = 'fichier'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nom_fichier = db.Column(db.String(255), nullable=False)
    type_fichier = db.Column(db.String(50))
    lien_fichier = db.Column(db.Text, nullable=False)
    cours_id = db.Column(db.String(36), db.ForeignKey('cours.id', ondelete='CASCADE'))

class Etudiant(db.Model):
    __tablename__ = 'etudiant'
    utilisateur_id = db.Column(db.String(36), primary_key=True)
    matricule = db.Column(db.String(20), unique=True, nullable=False)
    groupe_id = db.Column(db.String(36), db.ForeignKey('groupes.id', ondelete='CASCADE'))
    groupe = db.relationship('Groupes', backref='etudiants')

class Enseignant(db.Model):
    __tablename__ = 'enseignant'
    utilisateur_id = db.Column(db.String(36), primary_key=True)
    matiere = db.Column(db.String(100))
    groupe_id = db.Column(db.String(36), db.ForeignKey('groupes.id', ondelete='CASCADE'))
    groupe = db.relationship('Groupes', backref='enseignants')

class Groupes(db.Model):
    __tablename__ = 'groupes'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nom_groupe = db.Column(db.String(100), nullable=False)
