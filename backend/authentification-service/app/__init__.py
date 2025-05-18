import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .models import db

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/gestions_institut'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecretkey')

    db.init_app(app)
    CORS(app)
    JWTManager(app)

    with app.app_context():
        from .auth_routes import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        db.create_all()

    return app
