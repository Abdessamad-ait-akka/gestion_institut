import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/gestions_institut')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configuration des dossiers pour les fichiers
    app.config['UPLOAD_FOLDER_DEVOIRS'] = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads/devoirs')
    app.config['UPLOAD_FOLDER_SOUMISSIONS'] = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads/soumissions')
    
    # Créer les dossiers s'ils n'existent pas
    os.makedirs(app.config['UPLOAD_FOLDER_DEVOIRS'], exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER_SOUMISSIONS'], exist_ok=True)

    db.init_app(app)

    # ✅ Activer CORS pour autoriser  le frontend React (http://localhost:5173)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    # Importation des routes
    from .routes import devoirs_bp
    app.register_blueprint(devoirs_bp, url_prefix='/api/devoirs')

    return app
