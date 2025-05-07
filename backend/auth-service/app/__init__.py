# auth-service/app/__init__.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/gestions_institut'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'supersecretkey')

    db.init_app(app)
    CORS(app)

    with app.app_context():
        from .auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        db.create_all()

    return app
