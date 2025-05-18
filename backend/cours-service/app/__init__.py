from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'app', 'uploads')

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/gestions_institut'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Optionnel, pour éviter la mise en cache des fichiers

    @app.route('/uploads/<filename>', methods=['GET'])
    def download_file(filename):
        try:
            return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
        except FileNotFoundError:
            return jsonify({"error": "Fichier introuvable"}), 404

    db.init_app(app)
    CORS(app)

    from app.routes import cours_routes
    app.register_blueprint(cours_routes.bp, url_prefix='/api')

    return app
