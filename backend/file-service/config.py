import os

class Config:
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///fichier.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
