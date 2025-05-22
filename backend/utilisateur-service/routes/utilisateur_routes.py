from flask import Blueprint, request, jsonify
from app.models import db, Utilisateur, Etudiant, Enseignant, EnseignantGroupe, EnseignantMatiere, EnseignantFiliere
from werkzeug.security import generate_password_hash

utilisateur_bp = Blueprint('utilisateur_bp', __name__)


# READ ALL
@utilisateur_bp.route('/utilisateurs', methods=['GET'])
def get_all_utilisateurs():
    utilisateurs = Utilisateur.query.all()
    result = []
    for u in utilisateurs:
        user_data = {
            'id': u.id,
            'nom': u.nom,
            'prenom': u.prenom,
            'email': u.email,
            'role': u.role
        }
        result.append(user_data)
    return jsonify(result)

# CREATE
@utilisateur_bp.route('/utilisateurs', methods=['POST'])
def create_utilisateur():
    data = request.get_json()
    print("Données reçues pour la création de l'utilisateur:", data)
    
    try:
        # Création de l'utilisateur principal
        utilisateur = Utilisateur(
            nom=data['nom'],
            prenom=data['prenom'],
            email=data['email'],
            mot_de_passe=generate_password_hash(data['mot_de_passe']),
            role=data['role']
        )
        db.session.add(utilisateur)
        db.session.flush()  # Pour récupérer l'ID avant de commettre
        
        if utilisateur.role == 'etudiant':
            # Ajouter un étudiant
            etudiant = Etudiant(
                id_utilisateur=utilisateur.id,
                id_groupe=data['id_groupe'],
                id_filiere=data['id_filiere']
            )
            db.session.add(etudiant)
            print(f"Étudiant ajouté : {etudiant.id_utilisateur}, {etudiant.id_groupe}, {etudiant.id_filiere}")
        
        elif utilisateur.role == 'enseignant':
            # Ajouter un enseignant
            enseignant = Enseignant(id_utilisateur=utilisateur.id)
            db.session.add(enseignant)
            print(f"Enseignant ajouté : {enseignant.id_utilisateur}")
            
            for gid in data.get('groupes', []):
                db.session.add(EnseignantGroupe(enseignant_id=utilisateur.id, groupe_id=gid))
                print(f"Groupe ajouté pour l'enseignant {utilisateur.id}: {gid}")
            
            for mid in data.get('matieres', []):
                db.session.add(EnseignantMatiere(enseignant_id=utilisateur.id, matiere_id=mid))
                print(f"Matière ajoutée pour l'enseignant {utilisateur.id}: {mid}")
            
            for fid in data.get('filieres', []):
                db.session.add(EnseignantFiliere(enseignant_id=utilisateur.id, filiere_id=fid))
                print(f"Filière ajoutée pour l'enseignant {utilisateur.id}: {fid}")
        
        db.session.commit()
        return jsonify({'message': 'Utilisateur créé avec succès'}), 201
    except Exception as e:
        db.session.rollback()
        print("Erreur lors de la création de l'utilisateur:", str(e))
        return jsonify({'error': str(e)}), 500


# READ BY ID
@utilisateur_bp.route('/utilisateurs/<int:id>', methods=['GET'])
def get_utilisateur(id):
    utilisateur = Utilisateur.query.get_or_404(id)
    return jsonify({
        'id': utilisateur.id,
        'nom': utilisateur.nom,
        'prenom': utilisateur.prenom,
        'email': utilisateur.email,
        'role': utilisateur.role
    })

# UPDATE
@utilisateur_bp.route('/utilisateurs/<int:id>', methods=['PUT'])
def update_utilisateur(id):
    data = request.get_json()
    utilisateur = Utilisateur.query.get_or_404(id)

    utilisateur.nom = data.get('nom', utilisateur.nom)
    utilisateur.prenom = data.get('prenom', utilisateur.prenom)
    utilisateur.email = data.get('email', utilisateur.email)
    utilisateur.mot_de_passe = data.get('mot_de_passe', utilisateur.mot_de_passe)
    if 'mot_de_passe' in data and data['mot_de_passe']:
      utilisateur.mot_de_passe = generate_password_hash(data['mot_de_passe'])

    try:
        db.session.commit()
        return jsonify({'message': 'Utilisateur mis à jour avec succès'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# DELETE
@utilisateur_bp.route('/utilisateurs/<int:id>', methods=['DELETE'])
def delete_utilisateur(id):
    utilisateur = Utilisateur.query.get_or_404(id)

    try:
        # Suppression des entités liées à l'utilisateur avant de supprimer l'utilisateur
        if utilisateur.role == 'etudiant':
            Etudiant.query.filter_by(id_utilisateur=utilisateur.id).delete()
        elif utilisateur.role == 'enseignant':
            EnseignantGroupe.query.filter_by(enseignant_id=utilisateur.id).delete()
            EnseignantMatiere.query.filter_by(enseignant_id=utilisateur.id).delete()
            EnseignantFiliere.query.filter_by(enseignant_id=utilisateur.id).delete()
            Enseignant.query.filter_by(id_utilisateur=utilisateur.id).delete()

        db.session.delete(utilisateur)
        db.session.commit()
        return jsonify({'message': 'Utilisateur supprimé avec succès'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@utilisateur_bp.route('/users/counts', methods=['GET'])
def get_utilisateurs_counts():
    etudiants_count = Utilisateur.query.filter_by(role='etudiant').count()
    enseignants_count = Utilisateur.query.filter_by(role='enseignant').count()
    administrateurs_count = Utilisateur.query.filter_by(role='administrateur').count()

    return jsonify({
        "etudiants": etudiants_count,
        "enseignants": enseignants_count,
        "administrateurs": administrateurs_count
    })
