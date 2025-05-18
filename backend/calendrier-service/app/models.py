from app import db  # Importez db depuis __init__.py

from datetime import datetime

class Utilisateur(db.Model):
    __tablename__ = 'utilisateurs'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    mot_de_passe = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<Utilisateur {self.nom}>"

class Events(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('utilisateurs.id'), nullable=False)

    user = db.relationship('Utilisateur', backref='events')

    def __repr__(self):
        return f"<Event {self.title}>"
