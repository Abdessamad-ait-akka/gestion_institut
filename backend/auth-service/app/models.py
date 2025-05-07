# auth-service/app/models.py
from datetime import datetime, timedelta
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    mot_de_passe = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), nullable=False)

    def set_password(self, password):
        self.mot_de_passe = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.mot_de_passe, password)

class Authentification(db.Model):
    __tablename__ = 'authentification'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    utilisateur_id = db.Column(db.String(36), db.ForeignKey('utilisateur.id'), nullable=False)
    token = db.Column(db.Text, nullable=False)
    expiration = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(hours=1))

    utilisateur = db.relationship('Utilisateur', backref=db.backref('auth_tokens', lazy=True))
