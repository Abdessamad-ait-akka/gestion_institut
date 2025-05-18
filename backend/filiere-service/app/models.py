from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Filiere(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Filiere {self.nom}>"

    # Méthode pour convertir un objet en dictionnaire
    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom
        }
