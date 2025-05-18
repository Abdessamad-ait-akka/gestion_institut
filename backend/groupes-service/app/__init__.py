
from flask import Flask
from flask_cors import CORS
from app.models import db
from routes.groupes import groupe_bp

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/gestions_institut'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app)  # Pour éviter Failed to fetch en React

    app.register_blueprint(groupe_bp)

    return app
