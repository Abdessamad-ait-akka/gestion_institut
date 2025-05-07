# auth-service/app/auth.py
from flask import Blueprint, request, jsonify
from .models import db, Utilisateur, Authentification
import jwt
from datetime import datetime, timedelta
import uuid
import os

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    nom = data.get('nom')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if Utilisateur.query.filter_by(email=email).first():
        return jsonify({'error': 'Utilisateur déjà inscrit'}), 409

    user = Utilisateur(nom=nom, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Utilisateur enregistré'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = Utilisateur.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'email ou mot de pass incorrect'}), 401

    token_payload = {
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')

    auth = Authentification(utilisateur_id=user.id, token=token)
    db.session.add(auth)
    db.session.commit()

    return jsonify({'token': token, 'user': {
        'id': user.id,
        'nom': user.nom,
        'email': user.email,
        'role': user.role
    }}), 200
