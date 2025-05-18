from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

from app.models import db, Utilisateur, Etudiant, Groupe, Enseignant, EnseignantGroupe, EnseignantMatiere, EnseignantFiliere

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    mot_de_passe = data.get('mot_de_passe')

    utilisateur = Utilisateur.query.filter_by(email=email).first()

    if not utilisateur or not check_password_hash(utilisateur.mot_de_passe, mot_de_passe):
        return jsonify({'error': 'Email ou mot de passe invalide'}), 401

    access_token = create_access_token(identity=utilisateur.id, expires_delta=timedelta(days=1))

    response_data = {
        'token': access_token,
        'id_utilisateur': utilisateur.id,
        'nom': utilisateur.nom,
        'prenom': utilisateur.prenom,
        'email': utilisateur.email,
        'role': utilisateur.role
    }

    if utilisateur.role == 'etudiant':
        etudiant = Etudiant.query.filter_by(id_utilisateur=utilisateur.id).first()
        if etudiant:
            response_data['etudiant_id'] = etudiant.id_utilisateur
            response_data['groupe'] = etudiant.id_groupe
            response_data['filiere'] = etudiant.id_filiere

    elif utilisateur.role == 'enseignant':
        enseignant = Enseignant.query.filter_by(id_utilisateur=utilisateur.id).first()
        if enseignant:
            response_data['enseignant_id'] = enseignant.id_utilisateur

            groupes = EnseignantGroupe.query.filter_by(enseignant_id=enseignant.id_utilisateur).all()
            matieres = EnseignantMatiere.query.filter_by(enseignant_id=enseignant.id_utilisateur).all()
            filieres = EnseignantFiliere.query.filter_by(enseignant_id=enseignant.id_utilisateur).all()

            response_data['groupes'] = [g.groupe_id for g in groupes]
            response_data['matieres'] = [m.matiere_id for m in matieres]
            response_data['filieres'] = [f.filiere_id for f in filieres]

    return jsonify(response_data), 200

# Exemple de route protégée
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    return jsonify({'message': f'Utilisateur connecté ID: {user_id}'})
