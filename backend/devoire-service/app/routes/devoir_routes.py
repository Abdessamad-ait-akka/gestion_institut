
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from app.models import db, Devoir, Fichier, Etudiant, Enseignant
import os, jwt
import uuid
from datetime import datetime

bp = Blueprint('devoir', __name__)
SECRET_KEY = 'supersecretkey'
os.makedirs(os.path.join('uploads', 'soumissions'), exist_ok=True)

# Fonction pour obtenir l'utilisateur depuis le token
def get_user_from_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(" ")[1]
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except:
        return None

# Route pour créer un devoir
@bp.route('/devoir', methods=['POST'])
def upload_devoir():
    user = get_user_from_token()
    if not user or user.get('role') != 'enseignant':
        return jsonify({'error': 'Non autorisé'}), 403

    titre = request.form.get('titre')
    date_limite_str = request.form.get('date_limite')
    fichier = request.files.get('fichier')

    if not titre or not date_limite_str or not fichier:
        return jsonify({'error': 'Titre, date limite et fichier requis'}), 400

    try:
        date_limite = datetime.strptime(date_limite_str, '%Y-%m-%dT%H:%M')
        
    except ValueError:
        return jsonify({'error': 'Format de date invalide'}), 400

    filename = secure_filename(f"{uuid.uuid4().hex}_{fichier.filename}")
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    fichier.save(filepath)

    devoir = Devoir(
        id=str(uuid.uuid4()),
        titre=titre,
        date_limite=date_limite,
        enseignant_id=user['user_id']
    )

    db.session.add(devoir)
    db.session.flush()

    fichier_db = Fichier(
        nom_fichier=filename,
        type_fichier=fichier.content_type,
        lien_fichier=filename,
        devoir_id=devoir.id
    )
    db.session.add(fichier_db)
    db.session.commit()

    return jsonify({'message': 'Devoir créé avec succès'}), 201

# Route pour récupérer les devoirs
@bp.route('/devoirs', methods=['GET'])
def get_devoirs():
    user = get_user_from_token()
    if not user:
        return jsonify({'error': 'Non autorisé'}), 403

    result = []

    if user.get('role') == 'etudiant':
        etudiant = Etudiant.query.filter_by(utilisateur_id=user['user_id']).first()
        if not etudiant:
            return jsonify({'error': 'Étudiant non trouvé'}), 404

        devoir_list = Devoir.query.join(Enseignant, Devoir.enseignant_id == Enseignant.utilisateur_id)\
            .filter(Enseignant.groupe_id == etudiant.groupe_id).all()

    elif user.get('role') == 'enseignant':
        devoir_list = Devoir.query.filter_by(enseignant_id=user['user_id']).all()

    elif user.get('role') == 'administrateur':
        devoir_list = Devoir.query.all()

    else:
        return jsonify({'error': 'Rôle non autorisé'}), 403

    fichiers = Fichier.query.filter_by(etudiant_id=None).all()
    fichier_map = {f.devoir_id: f.lien_fichier for f in fichiers}

    for devoir in devoir_list:
        result.append({
            'id': devoir.id,
            'titre': devoir.titre,
            'date_limite': devoir.date_limite.strftime('%Y-%m-%d %H:%M'),
            'enseignant_id': devoir.enseignant_id,
            'fichier': os.path.basename(fichier_map.get(devoir.id)) if fichier_map.get(devoir.id) else None
        })

    return jsonify(result), 200

# Route pour soumettre un devoir
@bp.route('/devoir/<devoir_id>/soumettre', methods=['POST'])
def submit_devoir(devoir_id):
    try:
        devoir = Devoir.query.get(devoir_id)
        if not devoir:
            return jsonify({'error': 'Devoir non trouvé'}), 404

        print(f"Soumission reçue pour devoir_id : {devoir_id}")
        print(f"Date limite du devoir : {devoir.date_limite}")

        if datetime.now().date() > devoir.date_limite:
            return jsonify({'error': 'Date limite dépassée'}), 400

        file = request.files.get('fichier')
        if not file:
            return jsonify({'error': 'Aucun fichier reçu'}), 400

        filename = secure_filename(file.filename)
        file_ext = os.path.splitext(filename)[1].lower()

        print(f"Fichier reçu : {filename}, Extension : {file_ext}")

        soumission_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'soumissions')
        os.makedirs(soumission_folder, exist_ok=True)

        unique_filename = f"{uuid.uuid4()}{file_ext}"
        filepath = os.path.join(soumission_folder, unique_filename)
        file.save(filepath)

        print(f"Fichier sauvegardé sous : {filepath}")

        user = get_user_from_token()
        if not user or user.get('role') != 'etudiant':
            return jsonify({'error': 'Non autorisé'}), 403

        print(f"Utilisateur connecté : {user}")

        etudiant = Etudiant.query.filter_by(utilisateur_id=user['user_id']).first()
        if not etudiant:
            return jsonify({'error': 'Étudiant non trouvé'}), 404

        fichier = Fichier(
            id=str(uuid.uuid4()),
            nom_fichier=filename,
            type_fichier=file.content_type,
            lien_fichier=unique_filename,
            devoir_id=devoir_id,
            etudiant_id=etudiant.utilisateur_id,  # ✅ correction ici
            date_soumission=datetime.now()
        )

        db.session.add(fichier)
        db.session.commit()

        return jsonify({'message': 'Devoir soumis avec succès'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Erreur lors de la soumission : {e}")
        return jsonify({'error': 'Erreur serveur', 'details': str(e)}), 500



# Route pour télécharger un fichier de devoir
@bp.route('/devoirs/download/<path:filename>', methods=['GET'])
def download_file(filename):
    directory = os.path.join(current_app.config['UPLOAD_FOLDER'])
    return send_from_directory(directory, filename, as_attachment=True)


# Route pour supprimer un fichier de devoir (enseignant)
@bp.route('/devoir/<string:devoir_id>/fichier', methods=['DELETE'])
def delete_devoir_fichier(devoir_id):
    user = get_user_from_token()
    if not user or user.get('role') != 'enseignant':
        return jsonify({'error': 'Non autorisé'}), 403

    devoir = Devoir.query.get(devoir_id)
    if not devoir or devoir.enseignant_id != user['user_id']:
        return jsonify({'error': 'Devoir non trouvé ou accès refusé'}), 404

    fichier = Fichier.query.filter_by(devoir_id=devoir_id, etudiant_id=None).first()
    if not fichier:
        return jsonify({'error': 'Fichier non trouvé'}), 404

    fichier_path = os.path.join(current_app.config['UPLOAD_FOLDER'], fichier.lien_fichier)
    if os.path.exists(fichier_path):
        try:
            os.remove(fichier_path)
            db.session.delete(fichier)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f"Erreur lors de la suppression du fichier: {str(e)}"}), 500

    return jsonify({'message': 'Fichier supprimé avec succès'}), 200



@bp.route('/devoir/<devoir_id>/fichier', methods=['DELETE'])
def delete_devoir_file(devoir_id):
    user = get_user_from_token()
    if not user or user.get('role') != 'enseignant':
        return jsonify({'error': 'Non autorisé'}), 403

    # Récupérer le devoir
    devoir = Devoir.query.get(devoir_id)
    if not devoir:
        return jsonify({'error': 'Devoir non trouvé'}), 404

    # Vérifier que le devoir appartient à l’enseignant connecté
    if devoir.enseignant_id != user['user_id']:
        return jsonify({'error': 'Accès interdit'}), 403

    # Récupérer le fichier lié au devoir (sans etudiant_id)
    fichier = Fichier.query.filter_by(devoir_id=devoir_id, etudiant_id=None).first()
    if not fichier:
        return jsonify({'error': 'Fichier non trouvé'}), 404

    # Supprimer le fichier du disque si présent
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], fichier.lien_fichier)
    if os.path.exists(filepath):
        os.remove(filepath)

    # Supprimer l’entrée de la base de données
    db.session.delete(fichier)
    db.session.commit()

    return jsonify({'message': 'Fichier supprimé avec succès'}), 200


