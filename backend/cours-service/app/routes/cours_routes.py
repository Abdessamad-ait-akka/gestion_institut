from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from app import db
from app.models import Cours, CoursGroupes, Etudiant, Enseignant
import os
from datetime import datetime

bp = Blueprint('cours_routes', __name__)

@bp.route('/cours', methods=['POST'])
def upload_cours():
    try:
        titre = request.form.get('titre')
        enseignant_id = request.form.get('enseignant_id')
        filiere_id = request.form.get('filiere_id')
        matiere_id = request.form.get('matiere_id')
        groupe_ids = request.form.getlist('groupes')
        fichier = request.files.get('fichier')

        if not titre or not enseignant_id or not filiere_id or not fichier:
            return jsonify({"error": "Champs requis manquants"}), 400

        filename = secure_filename(fichier.filename)
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)
        fichier.save(upload_path)

        cours = Cours(
            titre=titre,
            fichier=filename,
            enseignant_id=int(enseignant_id),
            filiere_id=int(filiere_id),
            matiere_id=int(matiere_id) if matiere_id else None
        )
        db.session.add(cours)
        db.session.commit()

        for gid in groupe_ids:
            groupe_id = int(gid)
            association = CoursGroupes(cours_id=cours.id, groupe_id=groupe_id)
            db.session.add(association)

        db.session.commit()
        return jsonify({"message": "Cours envoyé avec succès."}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
        
@bp.route('/cours/etudiant/<int:id_utilisateur>', methods=['GET'])
def get_cours_etudiant(id_utilisateur):
    try:
        # Étudiant
        etudiant = Etudiant.query.filter_by(id_utilisateur=id_utilisateur).first()
        if not etudiant:
            return jsonify({"error": "Étudiant non trouvé", "details": f"Aucun étudiant trouvé pour l'ID {id_utilisateur}."}), 404

        if not etudiant.id_groupe:
            return jsonify({"error": "Groupe non défini pour l'étudiant", "details": "L'étudiant n'est affecté à aucun groupe."}), 400

        # Associations cours-groupe
        cours_groupes = CoursGroupes.query.filter_by(groupe_id=etudiant.id_groupe).all()
        if not cours_groupes:
            return jsonify({"error": "Aucun cours trouvé", "details": f"Aucun cours n'est associé au groupe ID {etudiant.id_groupe}."}), 404

        cours_serialized = []

        for cg in cours_groupes:
            if cg and cg.cours_id:
                cours = Cours.query.get(cg.cours_id)
                if cours:
                    cours_serialized.append({
                        'id': cours.id,
                        'titre': cours.titre,
                        'date_creation': cours.date_creation.strftime("%Y-%m-%d %H:%M:%S") if cours.date_creation else "",
                        'fichier': cours.fichier
                    })
                else:
                    return jsonify({"error": "Cours non trouvé", "details": f"Aucun cours trouvé avec l'ID {cg.cours_id}."}), 404
            else:
                return jsonify({"error": "Association invalide", "details": f"Association invalide ou cours_id manquant pour le groupe ID {etudiant.id_groupe}."}), 400

        if not cours_serialized:
            return jsonify({"error": "Aucun cours disponible", "details": "Aucun cours valide n'a été trouvé ou associé à ce groupe."}), 404

        return jsonify(cours_serialized), 200

    except Exception as e:
        return jsonify({"error": "Une erreur est survenue", "details": str(e)}), 500


@bp.route('/cours/enseignant/<int:id_enseignant>', methods=['GET'])
def get_cours_enseignant(id_enseignant):
    try:
        print(f"Requête reçue pour l'enseignant ID: {id_enseignant}")  # Log pour vérifier l'ID

        # Vérifier si l'enseignant existe
        enseignant = Enseignant.query.filter_by(id_utilisateur=id_enseignant).first()
        if not enseignant:
            print("Enseignant non trouvé.")  # Log si l'enseignant n'est pas trouvé
            return jsonify({"error": "Enseignant non trouvé."}), 404

        # Récupérer les cours associés à l'enseignant
        cours_list = Cours.query.filter_by(enseignant_id=id_enseignant).all()

        # Si aucun cours n'est trouvé
        if not cours_list:
            print("Aucun cours trouvé pour cet enseignant.")  # Log si aucun cours n'est trouvé
            return jsonify({"error": "Aucun cours trouvé pour cet enseignant."}), 404

        # Retourner les cours sous forme de JSON
        result = []
        for cours in cours_list:
            result.append({
                'id': cours.id,
                'titre': cours.titre,
                'fichier': cours.fichier,
                'date_creation': cours.date_creation.isoformat(),
                'matiere': cours.matiere.nom if cours.matiere else None,
                'filiere': cours.filiere.nom
            })
        return jsonify(result), 200

    except Exception as e:
        print(f"Erreur lors de la récupération des cours de l'enseignant : {str(e)}")  # Log de l'erreur
        return jsonify({'error': str(e)}), 500


@bp.route('/uploads/<path:filename>', methods=['GET'])
def download_file(filename):
    try:
        print("UPLOAD_FOLDER:", current_app.config['UPLOAD_FOLDER'])
        return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    except FileNotFoundError:
        print(f"Fichier introuvable : {filename}")
        return jsonify({"error": "Fichier introuvable"}), 404


@bp.route('/cours/<int:cours_id>', methods=['DELETE'])
def delete_cours(cours_id):
    try:
        cours = Cours.query.get(cours_id)
        if not cours:
            return jsonify({"error": "Cours non trouvé"}), 404

        # Supprimer le fichier associé
        fichier_path = os.path.join(current_app.config['UPLOAD_FOLDER'], cours.fichier)
        if os.path.exists(fichier_path):
            os.remove(fichier_path)

        # Supprimer les associations avec les groupes
        CoursGroupes.query.filter_by(cours_id=cours_id).delete()

        # Supprimer le cours
        db.session.delete(cours)
        db.session.commit()

        return jsonify({"message": "Cours supprimé avec succès"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500






@bp.route('/cours', methods=['GET'])
def get_cours():
    try:
        cours_list = Cours.query.all()
        result = []
        for cours in cours_list:
            result.append({
                'id': cours.id,
                'titre': cours.titre,
                'fichier': cours.fichier,
                'date_creation': cours.date_creation.isoformat(),
                'enseignant': {
                    'id': cours.enseignant.utilisateur.id,
                    'nom': cours.enseignant.utilisateur.nom,
                    'email': cours.enseignant.utilisateur.email,
                },
                'filiere_id': cours.filiere_id,
                'matiere_id': cours.matiere_id
            })
        return jsonify(result), 200
    except Exception as e:
        print("Erreur :", str(e))
        return jsonify({'error': str(e)}), 500

