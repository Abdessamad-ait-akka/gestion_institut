from flask import Flask
from flask_cors import CORS  # Importer Flask-CORS
from .models import db
from .routes import filiere_bp
import os
def create_app():
    app = Flask(__name__)

    # Activer CORS pour toutes les routes de l'application
    CORS(app)

    # Configuration de la base de données
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/gestions_institut')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialiser la base de données
    db.init_app(app)

    # Enregistrer les blueprints
    app.register_blueprint(filiere_bp)

    return app
