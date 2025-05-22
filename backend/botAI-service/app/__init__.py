from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# init extensions
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/gestions_institut'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # init
    db.init_app(app)
    CORS(app)

    # register blueprints
    from app.routes.bot_routes import bot_bp
    from app.routes.discussion_routes import discussion_bp
    app.register_blueprint(bot_bp, url_prefix='/api')
    app.register_blueprint(discussion_bp, url_prefix='/api')

    # create tables
    with app.app_context():
        db.create_all()

    return app
