from flask import Blueprint, request, jsonify
from app.models import db, Matiere

matiere_bp = Blueprint('matiere', __name__, url_prefix='/api/matieres')

@matiere_bp.route('', methods=['POST'])
def create_matiere():
    data = request.get_json()
    nom = data.get('nom')
    id_filiere = data.get('id_filiere')
    if not nom or not id_filiere:
        return jsonify({'message': 'Nom et ID de filière requis'}), 400
    matiere = Matiere(nom=nom, id_filiere=id_filiere)
    db.session.add(matiere)
    db.session.commit()
    return jsonify(matiere.to_dict()), 201

@matiere_bp.route('', methods=['GET'])
def get_matieres():
    matieres = Matiere.query.all()
    return jsonify([m.to_dict() for m in matieres])

@matiere_bp.route('/<int:id>', methods=['GET'])
def get_matiere(id):
    matiere = Matiere.query.get(id)
    if not matiere:
        return jsonify({'message': 'Matière non trouvée'}), 404
    return jsonify(matiere.to_dict())

@matiere_bp.route('/<int:id>', methods=['PUT'])
def update_matiere(id):
    matiere = Matiere.query.get(id)
    if not matiere:
        return jsonify({'message': 'Matière non trouvée'}), 404
    data = request.get_json()
    matiere.nom = data.get('nom', matiere.nom)
    matiere.id_filiere = data.get('id_filiere', matiere.id_filiere)
    db.session.commit()
    return jsonify(matiere.to_dict())

@matiere_bp.route('/<int:id>', methods=['DELETE'])
def delete_matiere(id):
    matiere = Matiere.query.get(id)
    if not matiere:
        return jsonify({'message': 'Matière non trouvée'}), 404
    db.session.delete(matiere)
    db.session.commit()
    return jsonify({'message': 'Matière supprimée avec succès'})
