from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialisation de la base de données
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configuration de l'application
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/gestions_institut'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'mysecretkey'  # Clé secrète pour les sessions, à personnaliser

    # Activation des CORS
    CORS(app)  # Permet toutes les requêtes CORS

    # Initialiser la base de données
    db.init_app(app)

    # Enregistrer les Blueprints
    from app.event_bp import event_bp  # Importer le Blueprint des événements
    app.register_blueprint(event_bp, url_prefix='/api')

    return app
