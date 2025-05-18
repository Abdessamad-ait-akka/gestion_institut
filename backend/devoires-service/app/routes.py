from flask import Blueprint, request, jsonify, current_app, send_from_directory
import os
from werkzeug.utils import secure_filename
from datetime import datetime, date
from app import db
from app.models import Devoir, SoumissionDevoir, Utilisateur, Groupe, Etudiant

devoirs_bp = Blueprint('devoirs_bp', __name__)

# Fonction utilitaire
def allowed_file(filename):
    allowed_extensions = {'pdf', 'doc', 'docx', 'txt'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

# ✅ Route : créer un devoir

@devoirs_bp.route('/create', methods=['POST'])
def create_devoir():
    data = request.form
    file = request.files.get('fichier')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER_DEVOIRS'], filename)
        file.save(file_path)

        # Récupération et conversion de la date limite
        date_limite_str = data.get('date_limite')
        try:
            date_limite = datetime.fromisoformat(date_limite_str)
        except ValueError:
            return jsonify({'message': 'Format de date invalide'}), 400

        # Création du devoir
        devoir = Devoir(
            titre=data['titre'],
            description=data.get('description', ''),
            fichier=file_path,
            date_limite=date_limite,
            enseignant_id=data['enseignant_id'],
            groupe_id=data['groupe_id']
        )

        db.session.add(devoir)
        db.session.commit()

        return jsonify({'message': 'Devoir créé avec succès'}), 201

    return jsonify({'message': 'Fichier non valide ou manquant'}), 400

# ✅ Route : soumettre un devoir
@devoirs_bp.route('/soumettre', methods=['POST'])
def soumettre_devoir():
    file = request.files.get('fichier')

    print("🔸 Reçu pour soumission de devoir :")
    print("Fichier :", file.filename if file else "Aucun fichier")
    print("Form :", request.form)

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER_SOUMISSIONS'], filename)
        file.save(file_path)

        devoir_id = request.form.get('devoir_id')
        etudiant_id = request.form.get('etudiant_id')
        commentaire = request.form.get('commentaire', '')

        soumission = SoumissionDevoir(
            devoir_id=devoir_id,
            etudiant_id=etudiant_id,
            fichier=file_path,
            commentaire=commentaire
        )

        db.session.add(soumission)
        db.session.commit()

        print("✅ Soumission enregistrée :", soumission)

        return jsonify({'message': 'Soumission réussie'}), 201

    print("❌ Fichier invalide ou manquant")
    return jsonify({'message': 'Fichier non valide ou manquant'}), 400

# ✅ Route : toutes les soumissions simples d’un devoir
@devoirs_bp.route('/soumissions/<int:devoir_id>', methods=['GET'])
def get_soumissions_brutes_par_devoir(devoir_id):
    soumissions = SoumissionDevoir.query.filter_by(devoir_id=devoir_id).all()
    result = []
    for s in soumissions:
        result.append({
            'id': s.id,
            'etudiant_id': s.etudiant_id,
            'fichier': s.fichier,
            'date_soumission': s.date_soumission,
            'note': str(s.note) if s.note else None,
            'commentaire': s.commentaire
        })
    return jsonify(result)

# ✅ Route : soumissions enrichies d’un devoir
@devoirs_bp.route('/api/soumissions/<int:devoir_id>', methods=['GET'])
def get_soumissions_detaillees_par_devoir(devoir_id):
    soumissions = SoumissionDevoir.query \
        .filter_by(devoir_id=devoir_id) \
        .join(Etudiant) \
        .join(Groupe) \
        .add_columns(
            SoumissionDevoir.id,
            SoumissionDevoir.fichier,
            SoumissionDevoir.date_soumissionisoformat(),
            SoumissionDevoir.note,
            SoumissionDevoir.commentaire,
            Etudiant.nom.label('nom'),
            Groupe.nom_groupe.label('nom_groupe')
        ).all()

    result = []
    for s in soumissions:
        result.append({
            'id': s.id,
            'fichier': s.fichier,
            'date_soumission': s.date_soumissionisoformat(),
            'note': s.note,
            'commentaire': s.commentaire,
            'nom': s.nom,
            'nom_groupe': s.nom_groupe
        })

    return jsonify(result)

# ✅ Route : récupérer tous les devoirs d’un groupe
@devoirs_bp.route('/devoirs/<int:groupe_id>', methods=['GET'])
def get_devoirs_by_groupe(groupe_id):
    devoirs = Devoir.query.filter_by(groupe_id=groupe_id).all()
    return jsonify([{
        'id': d.id,
        'titre': d.titre,
        'description': d.description,
        'fichier': d.fichier,
        'date_limite': d.date_limite.isoformat(),
        'enseignant_id': d.enseignant_id,
        'groupe_id': d.groupe_id
    } for d in devoirs]), 200

# ✅ Route : devoirs actifs d’un groupe (filtrés par date)
@devoirs_bp.route('/actifs/<int:groupe_id>', methods=['GET'])
def get_devoirs_actifs_by_groupe(groupe_id):
    try:
        today = date.today()
        devoirs = Devoir.query.filter(
            Devoir.groupe_id == groupe_id
            
        ).all()

        resultats = [{
            'id': d.id,
            'titre': d.titre,
            'description': d.description,
            'fichier': os.path.basename(d.fichier) if d.fichier else None,
            'date_limite': d.date_limite.isoformat(),
            'enseignant_id': d.enseignant_id,
            'groupe_id': d.groupe_id
        } for d in devoirs]

        return jsonify(resultats), 200

    except Exception as e:
        print(f"[ERREUR] {e}")
        return jsonify({'message': 'Erreur serveur', 'error': str(e)}), 500

# ✅ Route : tous les devoirs d’un enseignant
@devoirs_bp.route('/enseignant/<int:enseignant_id>', methods=['GET'])
def get_devoirs_by_enseignant(enseignant_id):
    devoirs = Devoir.query.filter_by(enseignant_id=enseignant_id).all()
    return jsonify([{
        'id': d.id,
        'titre': d.titre,
        'description': d.description,
        'fichier': os.path.basename(d.fichier),
        'date_limite': d.date_limite.isoformat(),
        'enseignant_id': d.enseignant_id,
        'groupe_id': d.groupe_id
    } for d in devoirs]), 200

# ✅ Route : télécharger un fichier devoir
@devoirs_bp.route('/telecharger/<filename>', methods=['GET'])
def download_devoir(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER_DEVOIRS'], filename, as_attachment=True)

# ✅ Route : télécharger un fichier de soumission
@devoirs_bp.route('/telecharger/soumission/<filename>', methods=['GET'])
def download_soumission(filename):
    try:
        return send_from_directory(
            current_app.config['UPLOAD_FOLDER_SOUMISSIONS'],
            filename,
            as_attachment=True
        )
    except FileNotFoundError:
        return jsonify({'message': 'Fichier de soumission non trouvé'}), 404

# ✅ Route : supprimer un devoir
@devoirs_bp.route('/<int:devoir_id>', methods=['DELETE'])
def delete_devoir(devoir_id):
    devoir = Devoir.query.get_or_404(devoir_id)

    if devoir.fichier and os.path.exists(devoir.fichier):
        os.remove(devoir.fichier)

    db.session.delete(devoir)
    db.session.commit()

    return jsonify({'message': 'Devoir supprimé avec succès'}), 200



@devoirs_bp.route('/mes_soumissions', methods=['GET'])
def get_mes_soumissions():
    etudiant_id = request.args.get('etudiant_id')
    if not etudiant_id:
        return jsonify({'message': 'etudiant_id requis'}), 400

    soumissions = SoumissionDevoir.query.filter_by(etudiant_id=etudiant_id).all()
    result = [{
        'id': s.id,
        'devoir_id': s.devoir_id,
        'fichier': s.fichier,
        'date_soumission': s.date_soumission.isoformat(),
        'note': str(s.note) if s.note else None,
        'commentaire': s.commentaire
    } for s in soumissions]

    return jsonify(result), 200
    
@devoirs_bp.route('/telecharger/soumission/<filename>', methods=['GET'])
def telecharger_soumission(filename):
    safe_filename = secure_filename(filename)
    folder = current_app.config['UPLOAD_FOLDER_SOUMISSIONS']
    file_path = os.path.join(folder, safe_filename)

    if not os.path.exists(file_path):
        return jsonify({'message': 'Fichier non trouvé'}), 404

    return send_from_directory(folder, safe_filename, as_attachment=True)


@devoirs_bp.route('/soumissions/<int:id>', methods=['DELETE'])
def supprimer_soumission(id):
    soumission = SoumissionDevoir.query.get(id)
    if not soumission:
        return jsonify({'message': 'Soumission non trouvée'}), 404

    fichier_nom = os.path.basename(soumission.fichier)
    fichier_path = os.path.join(current_app.config['UPLOAD_FOLDER_SOUMISSIONS'], fichier_nom)
    if os.path.exists(fichier_path):
        try:
            os.remove(fichier_path)
        except Exception as e:
            print(f"Erreur lors de la suppression du fichier: {e}")

    db.session.delete(soumission)
    db.session.commit()

    return jsonify({'message': 'Soumission supprimée avec succès'}), 200
