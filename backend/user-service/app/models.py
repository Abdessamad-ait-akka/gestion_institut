from . import db
import uuid

class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    mot_de_passe = db.Column(db.Text, nullable=False)

    etudiant = db.relationship("Etudiant", backref="utilisateur", uselist=False, cascade="all, delete-orphan")
    enseignant = db.relationship("Enseignant", backref="utilisateur", uselist=False, cascade="all, delete-orphan")
    administrateur = db.relationship("Administrateur", backref="utilisateur", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'email': self.email,
            'role': self.role
        }


class Etudiant(db.Model):
    __tablename__ = 'etudiant'

    utilisateur_id = db.Column(db.String(36), db.ForeignKey('utilisateur.id', ondelete='CASCADE'), primary_key=True)
    matricule = db.Column(db.String(20), unique=True, nullable=False)
    groupe_id = db.Column(db.Integer, nullable=False)
    nom_groupe = db.Column(db.String(100), nullable=False)


class Enseignant(db.Model):
    __tablename__ = 'enseignant'

    utilisateur_id = db.Column(db.String(36), db.ForeignKey('utilisateur.id', ondelete='CASCADE'), primary_key=True)
    matiere = db.Column(db.String(100), nullable=False)
    groupe_id = db.Column(db.Integer, nullable=False)
    nom_groupe = db.Column(db.String(100), nullable=False)


class Administrateur(db.Model):
    __tablename__ = 'administrateur'

    utilisateur_id = db.Column(db.String(36), db.ForeignKey('utilisateur.id', ondelete='CASCADE'), primary_key=True)
    niveau_acces = db.Column(db.String(50), nullable=False)
