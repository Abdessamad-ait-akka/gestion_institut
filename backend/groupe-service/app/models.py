from app import db

class Groupe(db.Model):
    __tablename__ = 'groupes'
    id = db.Column(db.String(36), primary_key=True)
    nom_groupe = db.Column(db.String(100), nullable=False)
