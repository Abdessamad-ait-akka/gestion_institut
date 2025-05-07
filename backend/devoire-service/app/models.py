
from app import db
import uuid

class Devoir(db.Model):
    __tablename__ = 'devoir'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    titre = db.Column(db.String(255), nullable=False)
    date_limite = db.Column(db.DateTime, nullable=False)
    etudiant_id = db.Column(db.String(36), db.ForeignKey('etudiant.utilisateur_id'), nullable=False)
    enseignant_id = db.Column(db.String(36), db.ForeignKey('enseignant.utilisateur_id'), nullable=False)
    note = db.Column(db.Float, nullable=True)

    # Relations
    etudiant = db.relationship('Etudiant', backref=db.backref('devoirs', lazy=True))
    enseignant = db.relationship('Enseignant', backref=db.backref('devoirs', lazy=True))

class Fichier(db.Model):
    __tablename__ = 'fichier'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nom_fichier = db.Column(db.String(255), nullable=False)
    type_fichier = db.Column(db.String(50))
    lien_fichier = db.Column(db.Text, nullable=False)
    devoir_id = db.Column(db.String(36), db.ForeignKey('devoir.id', ondelete='CASCADE'), nullable=False)
    etudiant_id = db.Column(db.String(36), db.ForeignKey('etudiant.utilisateur_id'), nullable=True)
    date_soumission = db.Column(db.DateTime, nullable=True)

    # Relations
    devoir = db.relationship('Devoir', backref=db.backref('fichiers', lazy=True))
    etudiant = db.relationship('Etudiant', backref=db.backref('fichiers', lazy=True))


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



