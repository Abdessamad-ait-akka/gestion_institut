import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from .models import db, Fichier

file_bp = Blueprint('file_bp', __name__)

@file_bp.route('/upload/cours/<cours_id>', methods=['POST'])
def upload_cours(cours_id):
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier fourni'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nom de fichier vide'}), 400
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    new_file = Fichier(
        nom_fichier=filename,
        type_fichier=file.content_type,
        lien_fichier=f"/uploads/{unique_filename}",
        cours_id=cours_id
    )
    db.session.add(new_file)
    db.session.commit()
    return jsonify({'message': 'Fichier de cours uploadé avec succès', 'file_id': new_file.id}), 201

@file_bp.route('/upload/devoir/<devoir_id>', methods=['POST'])
def upload_devoir(devoir_id):
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier fourni'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nom de fichier vide'}), 400
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    new_file = Fichier(
        nom_fichier=filename,
        type_fichier=file.content_type,
        lien_fichier=f"/uploads/{unique_filename}",
        devoir_id=devoir_id
    )
    db.session.add(new_file)
    db.session.commit()
    return jsonify({'message': 'Fichier de devoir uploadé avec succès', 'file_id': new_file.id}), 201
