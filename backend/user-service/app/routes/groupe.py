from flask import Blueprint, jsonify
from app.models import Groupe

groupe_bp = Blueprint('groupe_routes', __name__)

@groupe_bp.route('/groupes', methods=['GET'])
def get_groupes():
    groupes = Groupe.query.all()
    return jsonify([{'id': g.id, 'nom_groupe': g.nom_groupe} for g in groupes])
