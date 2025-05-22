from datetime import datetime
from app import db

class Discussion(db.Model):
    __tablename__ = 'discussion_bot'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    utilisateur_id = db.Column(db.Integer, nullable=True)
    message_utilisateur = db.Column(db.Text, nullable=False)
    reponse_bot = db.Column(db.Text, nullable=False)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
