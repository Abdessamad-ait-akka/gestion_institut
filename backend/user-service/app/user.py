
# --- user routes with SQLAlchemy ORM ---
from flask import Blueprint, request, jsonify
from . import db
from .models import Utilisateur, Etudiant, Enseignant, Administrateur
from werkzeug.security import generate_password_hash, check_password_hash

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    utilisateurs = Utilisateur.query.all()
    return jsonify([u.to_dict() for u in utilisateurs]), 200

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Aucune donnée envoyée'}), 400

    print("Données reçues : ", data)

    try:
        # Création de l'utilisateur
        nouvel_utilisateur = Utilisateur(
            nom=data['nom'],
            email=data['email'],
            role=data['role'],
            mot_de_passe=generate_password_hash(data['mot_de_passe'])
        )
        db.session.add(nouvel_utilisateur)
        db.session.flush()  # Pour obtenir l'ID sans commit

        # Création des infos spécifiques selon le rôle
        if data['role'] == 'etudiant':
            if 'matricule' not in data or 'groupes' not in data or len(data['groupes']) == 0:
                return jsonify({'error': 'Le matricule et groupes sont requis pour les étudiants'}), 400
            for groupe_id in data['groupes']:
                etudiant = Etudiant(
                    utilisateur_id=nouvel_utilisateur.id, 
                    matricule=data['matricule'], 
                    groupe_id=groupe_id, 
                )
                db.session.add(etudiant)

        elif data['role'] == 'enseignant':
            if 'matiere' not in data or 'groupes' not in data or len(data['groupes']) == 0:
                return jsonify({'error': 'La matière et groupes sont requis pour les enseignants'}), 400
            for groupe_id in data['groupes']:
                enseignant = Enseignant(
                    utilisateur_id=nouvel_utilisateur.id, 
                    matiere=data['matiere'], 
                    groupe_id=groupe_id,
                    # Ne pas inclure "matricule" ici, car ce n'est pas nécessaire pour l'enseignant
                )
                db.session.add(enseignant)

        elif data['role'] == 'administrateur':
            niveau = data.get('niveau_acces', 'normal')
            admin = Administrateur(utilisateur_id=nouvel_utilisateur.id, niveau_acces=niveau)
            db.session.add(admin)

        else:
            return jsonify({'error': 'Rôle invalide'}), 400

        db.session.commit()
        return jsonify({'message': 'Utilisateur créé avec succès'}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")  # Log de l'exception
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    utilisateur = Utilisateur.query.get(id)
    if not utilisateur:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    try:
        utilisateur.nom = data.get('nom', utilisateur.nom)
        utilisateur.email = data.get('email', utilisateur.email)
        utilisateur.role = data.get('role', utilisateur.role)
        if data.get('mot_de_passe'):
            utilisateur.mot_de_passe = generate_password_hash(data['mot_de_passe'])

        Etudiant.query.filter_by(utilisateur_id=id).delete()
        Enseignant.query.filter_by(utilisateur_id=id).delete()
        Administrateur.query.filter_by(utilisateur_id=id).delete()

        if utilisateur.role == 'etudiant':
            db.session.add(Etudiant(utilisateur_id=id, matricule=data['matricule']))
        elif utilisateur.role == 'enseignant':
            db.session.add(Enseignant(utilisateur_id=id, matiere=data['matiere']))
        elif utilisateur.role == 'administrateur':
            db.session.add(Administrateur(utilisateur_id=id, niveau_acces=data['niveau_acces']))
        else:
            return jsonify({'error': 'Rôle invalide'}), 400

        db.session.commit()
        return jsonify(utilisateur.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<string:id>', methods=['DELETE'])
def delete_user(id):
    utilisateur = Utilisateur.query.get(id)
    if not utilisateur:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    db.session.delete(utilisateur)
    db.session.commit()
    return jsonify({'message': 'Utilisateur supprimé avec succès'}), 200

