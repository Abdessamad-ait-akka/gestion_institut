from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Initialisation de la base de données
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configuration de la base de données
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/gestions_institut'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Configuration du dossier d'upload
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'app', 'uploads', 'devoirs')
    #app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'app', 'uploads', 'soumissions')

    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limite de taille pour les fichiers (16MB)

    # Créer le dossier s'il n'existe pas
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialisation de la base de données
    db.init_app(app)

    # Activation de CORS pour permettre les requêtes croisées
    CORS(app)

    # Enregistrement des routes
    from app.routes.devoir_routes import bp
    app.register_blueprint(bp)

    return app


