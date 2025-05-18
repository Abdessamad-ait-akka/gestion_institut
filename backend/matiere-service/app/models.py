from app import db

class Filiere(db.Model):
    __tablename__ = 'filiere'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    matieres = db.relationship('Matiere', backref='filiere', lazy=True)

class Matiere(db.Model):
    __tablename__ = 'matiere'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    id_filiere = db.Column(db.Integer, db.ForeignKey('filiere.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'id_filiere': self.id_filiere,
            'filiere_nom': self.filiere.nom if self.filiere else None
        }

