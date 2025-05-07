from flask import Blueprint, request, jsonify
from app import db
from app.models import Groupe
import uuid

groupe_bp = Blueprint('groupe_bp', __name__)

# Créer un groupe
@groupe_bp.route('/groupes', methods=['POST'])
def create_groupe():
    data = request.get_json()
    nom = data.get('nom')
    if not nom:
        return jsonify({"message": "Le nom du groupe est requis"}), 400

    groupe = Groupe(id=str(uuid.uuid4()), nom_groupe=nom)
    db.session.add(groupe)
    db.session.commit()
    return jsonify({"message": "Groupe créé", "id": groupe.id}), 201

# Obtenir tous les groupes
@groupe_bp.route('/groupes', methods=['GET'])
def get_groupes():
    groupes = Groupe.query.all()
    return jsonify([
        {
            "id": g.id,
            "nom_groupe": g.nom_groupe
        }
        for g in groupes
    ])

# Mettre à jour un groupe
@groupe_bp.route('/groupes/<string:groupe_id>', methods=['PUT'])
def update_groupe(groupe_id):
    data = request.get_json()
    groupe = Groupe.query.get_or_404(groupe_id)
    groupe.nom_groupe = data.get('nom', groupe.nom_groupe)
    db.session.commit()
    return jsonify({"message": "Groupe mis à jour"})

# Supprimer un groupe
@groupe_bp.route('/groupes/<string:groupe_id>', methods=['DELETE'])
def delete_groupe(groupe_id):
    groupe = Groupe.query.get_or_404(groupe_id)
    db.session.delete(groupe)
    db.session.commit()
    return jsonify({"message": "Groupe supprimé"})
