from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()

class Fichier(db.Model):
    __tablename__ = 'fichier'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nom_fichier = db.Column(db.String(255), nullable=False)
    type_fichier = db.Column(db.String(50))
    lien_fichier = db.Column(db.Text, nullable=False)
    cours_id = db.Column(db.String(36), nullable=True)
    devoir_id = db.Column(db.String(36), nullable=True)
