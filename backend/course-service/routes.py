from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from models import db, Cours, Fichier, Etudiant, Enseignant
import os, jwt

bp = Blueprint('cours', __name__)
SECRET_KEY = 'supersecretkey'

def get_user_from_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(" ")[1]
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except:
        return None

@bp.route('/cours', methods=['POST'])
def upload_cours():
    user = get_user_from_token()
    if not user or user.get('role') != 'enseignant':
        return jsonify({'error': 'Non autorisé'}), 403

    titre = request.form.get('titre')
    description = request.form.get('description')
    fichier = request.files.get('fichier')

    if not titre or not fichier:
        return jsonify({'error': 'Titre et fichier requis'}), 400

    filename = secure_filename(fichier.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    fichier.save(filepath)

    cours = Cours(titre=titre, description=description, enseignant_id=user['user_id'])
    db.session.add(cours)
    db.session.flush()  # Pour récupérer cours.id avant commit

    fichier_db = Fichier(
        nom_fichier=filename,
        type_fichier=fichier.content_type,
        lien_fichier=filename,  # On stocke seulement le nom
        cours_id=cours.id
    )
    db.session.add(fichier_db)
    db.session.commit()

    return jsonify({'message': 'Cours enregistré'}), 201

@bp.route('/cours', methods=['GET'])
def get_cours():
    user = get_user_from_token()
    if not user:
        return jsonify({'error': 'Non autorisé'}), 403

    result = []

    if user.get('role') == 'etudiant':
        etudiant = Etudiant.query.filter_by(utilisateur_id=user['user_id']).first()
        if not etudiant:
            return jsonify({'error': 'Étudiant non trouvé'}), 404

        groupe_id = etudiant.groupe_id
        enseignants = Enseignant.query.filter_by(groupe_id=groupe_id).all()
        if not enseignants:
            return jsonify({'error': 'Aucun enseignant trouvé pour ce groupe'}), 404

        cours_list = Cours.query.filter(Cours.enseignant_id.in_([e.utilisateur_id for e in enseignants])).all()
    
    elif user.get('role') == 'enseignant':
        cours_list = Cours.query.filter_by(enseignant_id=user['user_id']).all()
    
    elif user.get('role') == 'administrateur':
        cours_list = Cours.query.all()

    else:
        return jsonify({'error': 'Rôle non autorisé'}), 403

    fichiers = Fichier.query.all()
    fichier_map = {f.cours_id: f.lien_fichier for f in fichiers}

    for cours in cours_list:
        result.append({
            'id': cours.id,
            'titre': cours.titre,
            'description': cours.description,
            'enseignant_id': cours.enseignant_id,
            'fichier': os.path.basename(fichier_map.get(cours.id)) if fichier_map.get(cours.id) else None
        })
    
    return jsonify(result), 200



@bp.route('/cours/<int:cours_id>/fichier', methods=['DELETE'])
def delete_fichier(cours_id):
    user = get_user_from_token()
    print("Utilisateur :", user)

    # Vérifie que l'utilisateur est bien un enseignant
    if not user or user.get('role') != 'enseignant':
        print("Non autorisé : rôle incorrect ou utilisateur manquant.")
        return jsonify({'error': 'Non autorisé'}), 403

    # Recherche du cours correspondant
    cours = Cours.query.get(cours_id)
    print("Cours trouvé :", cours)

    if not cours or cours.enseignant_id != user['user_id']:
        print("Cours non trouvé ou enseignant non propriétaire.")
        return jsonify({'error': 'Cours non trouvé ou accès refusé'}), 404

    # Recherche du fichier lié au cours
    fichier = Fichier.query.filter_by(cours_id=cours_id).first()
    print("Fichier trouvé :", fichier)

    if not fichier:
        print("Aucun fichier associé au cours.")
        return jsonify({'error': 'Fichier non trouvé'}), 404

    # Construction du chemin physique
    fichier_path = os.path.join(current_app.config['UPLOAD_FOLDER'], fichier.lien_fichier)
    print("Chemin fichier :", fichier_path)

    # Suppression physique du fichier s’il existe
    if os.path.exists(fichier_path):
        os.remove(fichier_path)
        print("Fichier supprimé physiquement.")
    else:
        print("Fichier introuvable physiquement.")

    # Suppression dans la base de données
    db.session.delete(fichier)
    db.session.commit()
    print("Fichier supprimé en base de données.")

    return jsonify({'message': 'Fichier supprimé avec succès'}), 200

@bp.route('/cours/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
