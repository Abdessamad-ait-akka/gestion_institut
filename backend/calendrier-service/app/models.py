from app import db
import uuid
from datetime import datetime

class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'
    id = db.Column(db.String(36), primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    mot_de_passe = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<Utilisateur {self.nom}>"

class Events(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.String(36), primary_key=True, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('utilisateur.id'), nullable=False)

    user = db.relationship('Utilisateur', backref='events')

    def __init__(self, title, description, start_time, end_time, user_id):
        self.id = str(uuid.uuid4())
        self.title = title
        self.description = description
        self.start_time = start_time
        self.end_time = end_time
        self.user_id = user_id

    def __repr__(self):
        return f"<Event {self.title}>"
