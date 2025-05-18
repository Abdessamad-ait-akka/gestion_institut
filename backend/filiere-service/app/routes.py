from flask import Blueprint, request, jsonify
from .models import db, Filiere

filiere_bp = Blueprint('filiere', __name__, url_prefix='/api/filieres')

# Créer une filière
@filiere_bp.route('', methods=['POST'])
def create_filiere():
    data = request.get_json()
    nom = data.get('nom')

    if not nom:
        return jsonify({'message': 'Le nom est requis'}), 400

    filiere = Filiere(nom=nom)
    db.session.add(filiere)
    db.session.commit()
    return jsonify(filiere.to_dict()), 201

# Récupérer toutes les filières
@filiere_bp.route('', methods=['GET'])
def get_filieres():
    filieres = Filiere.query.all()
    return jsonify([filiere.to_dict() for filiere in filieres])

# Récupérer une filière par son ID
@filiere_bp.route('/<int:id>', methods=['GET'])
def get_filiere(id):
    filiere = Filiere.query.get(id)
    if not filiere:
        return jsonify({'message': 'Filière non trouvée'}), 404
    return jsonify(filiere.to_dict())

# Mettre à jour une filière
@filiere_bp.route('/<int:id>', methods=['PUT'])
def update_filiere(id):
    filiere = Filiere.query.get(id)
    if not filiere:
        return jsonify({'message': 'Filière non trouvée'}), 404

    data = request.get_json()
    filiere.nom = data.get('nom', filiere.nom)

    db.session.commit()
    return jsonify(filiere.to_dict())

# Supprimer une filière
@filiere_bp.route('/<int:id>', methods=['DELETE'])
def delete_filiere(id):
    filiere = Filiere.query.get(id)
    if not filiere:
        return jsonify({'message': 'Filière non trouvée'}), 404

    db.session.delete(filiere)
    db.session.commit()
    return jsonify({'message': 'Filière supprimée avec succès'}), 200


