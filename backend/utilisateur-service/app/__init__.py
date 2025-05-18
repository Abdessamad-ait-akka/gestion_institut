from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Crée l'instance de SQLAlchemy
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configuration de la base de données
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/gestions_institut')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialisation de l'app avec SQLAlchemy
    db.init_app(app)

    # Activer CORS pour autoriser les requêtes depuis le frontend React
    CORS(app, origins=["http://localhost:5173"])

    # Enregistrement des routes
    from routes.utilisateur_routes import utilisateur_bp
    app.register_blueprint(utilisateur_bp, url_prefix="/api")

    return app
