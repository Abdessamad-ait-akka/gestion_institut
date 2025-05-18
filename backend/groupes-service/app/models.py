from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Filiere(db.Model):
    __tablename__ = 'filiere'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    groupes = db.relationship('Groupe', backref='filiere', lazy=True)

class Groupe(db.Model):
    __tablename__ = 'groupe'
    id = db.Column(db.Integer, primary_key=True)
    nom_groupe = db.Column(db.String(100), nullable=False)
    id_filiere = db.Column(db.Integer, db.ForeignKey('filiere.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nom_groupe': self.nom_groupe,
            'id_filiere': self.id_filiere,
            'filiere_nom': self.filiere.nom  # important pour affichage React
        }
