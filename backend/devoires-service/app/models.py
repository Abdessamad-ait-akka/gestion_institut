from . import db
from datetime import datetime

class Utilisateur(db.Model):
    __tablename__ = 'utilisateurs'

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True)
    mot_de_passe = db.Column(db.String(255))
    role = db.Column(db.String(50))

    # Relations 1-1 vers Enseignant et Etudiant
    enseignant = db.relationship('Enseignant', backref='utilisateur', uselist=False, cascade="all, delete-orphan")
    etudiant = db.relationship('Etudiant', backref='utilisateur', uselist=False, cascade="all, delete-orphan")

class Enseignant(db.Model):
    __tablename__ = 'enseignants'

    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id', ondelete="CASCADE"), primary_key=True)

    devoirs = db.relationship('Devoir', backref='enseignant', lazy=True, cascade="all, delete-orphan")

class Etudiant(db.Model):
    __tablename__ = 'etudiants'

    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id', ondelete="CASCADE"), primary_key=True)
    groupe_id = db.Column(db.Integer, db.ForeignKey('groupe.id', ondelete="SET NULL"), nullable=True)

    groupe = db.relationship('Groupe', backref=db.backref('etudiants', lazy=True))

    soumissions = db.relationship('SoumissionDevoir', backref='etudiant', lazy=True, cascade="all, delete-orphan")

class Groupe(db.Model):
    __tablename__ = 'groupe'

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)

    devoirs = db.relationship('Devoir', backref='groupe', lazy=True, cascade="all, delete-orphan")

class Devoir(db.Model):
    __tablename__ = 'devoirs'

    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    fichier = db.Column(db.String(255))
    date_limite = db.Column(db.Date, nullable=False)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    enseignant_id = db.Column(db.Integer, db.ForeignKey('enseignants.id_utilisateur'), nullable=False)
    groupe_id = db.Column(db.Integer, db.ForeignKey('groupe.id'), nullable=False)
    note = db.Column(db.Numeric(5, 2))

    soumissions = db.relationship('SoumissionDevoir', backref='devoir', lazy=True, cascade="all, delete-orphan")

class SoumissionDevoir(db.Model):
    __tablename__ = 'soumissions_devoirs'

    id = db.Column(db.Integer, primary_key=True)
    devoir_id = db.Column(db.Integer, db.ForeignKey('devoirs.id', ondelete="CASCADE"), nullable=False)
    etudiant_id = db.Column(db.Integer, db.ForeignKey('etudiants.id_utilisateur', ondelete="CASCADE"), nullable=False)
    fichier = db.Column(db.String(255))
    date_soumission = db.Column(db.DateTime, default=datetime.utcnow)
    note = db.Column(db.Numeric(5, 2))
    commentaire = db.Column(db.Text)

    __table_args__ = (
        db.UniqueConstraint('devoir_id', 'etudiant_id', name='unique_soumission'),
    )
