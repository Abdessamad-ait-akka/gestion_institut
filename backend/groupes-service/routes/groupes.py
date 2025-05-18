from flask import Blueprint, request, jsonify
from app.models import db, Groupe, Filiere

groupe_bp = Blueprint('groupe', __name__, url_prefix='/api/groupes')

@groupe_bp.route('', methods=['POST'])
def create_groupe():
    data = request.get_json()
    nom_groupe = data.get('nom_groupe')
    id_filiere = data.get('id_filiere')

    if not nom_groupe or not id_filiere:
        return jsonify({'message': 'Nom du groupe et ID de la filière sont requis'}), 400

    groupe = Groupe(nom_groupe=nom_groupe, id_filiere=id_filiere)
    db.session.add(groupe)
    db.session.commit()
    return jsonify(groupe.to_dict()), 201

@groupe_bp.route('', methods=['GET'])
def get_groupes():
    groupes = Groupe.query.all()
    return jsonify([g.to_dict() for g in groupes]), 200

@groupe_bp.route('/<int:id>', methods=['GET'])
def get_groupe(id):
    groupe = Groupe.query.get(id)
    if not groupe:
        return jsonify({'message': 'Groupe non trouvé'}), 404
    return jsonify(groupe.to_dict())

@groupe_bp.route('/<int:id>', methods=['PUT'])
def update_groupe(id):
    groupe = Groupe.query.get(id)
    if not groupe:
        return jsonify({'message': 'Groupe non trouvé'}), 404

    data = request.get_json()
    groupe.nom_groupe = data.get('nom_groupe', groupe.nom_groupe)
    groupe.id_filiere = data.get('id_filiere', groupe.id_filiere)

    db.session.commit()
    return jsonify(groupe.to_dict())

@groupe_bp.route('/<int:id>', methods=['DELETE'])
def delete_groupe(id):
    groupe = Groupe.query.get(id)
    if not groupe:
        return jsonify({'message': 'Groupe non trouvé'}), 404

    db.session.delete(groupe)
    db.session.commit()
    return jsonify({'message': 'Groupe supprimé avec succès'}), 200
