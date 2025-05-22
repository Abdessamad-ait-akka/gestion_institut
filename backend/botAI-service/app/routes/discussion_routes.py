from flask import Blueprint, jsonify, request, current_app
from app import db
from app.models import Discussion

discussion_bp = Blueprint('discussion_bp', __name__)

@discussion_bp.route('/discussions', methods=['GET'])
def get_discussions():
    # utilisateur_id reste optionnel
    utilisateur_id = request.args.get('utilisateur_id', type=int)
    query = Discussion.query
    if utilisateur_id is not None:
        query = query.filter_by(utilisateur_id=utilisateur_id)
    ds = query.order_by(Discussion.date_creation.desc()).all()

    return jsonify([
        {
            'id': d.id,
            'utilisateur_id': d.utilisateur_id,
            'message_utilisateur': d.message_utilisateur,
            'reponse_bot': d.reponse_bot,
            'date_creation': d.date_creation.isoformat()
        } for d in ds
    ]), 200

@discussion_bp.route('/discussions/<int:id>', methods=['GET'])
def get_discussion(id):
    d = Discussion.query.get_or_404(id)
    return jsonify({
        'id': d.id,
        'utilisateur_id': d.utilisateur_id,
        'message_utilisateur': d.message_utilisateur,
        'reponse_bot': d.reponse_bot,
        'date_creation': d.date_creation.isoformat()
    }), 200

@discussion_bp.route('/discussions/<int:id>', methods=['PUT'])
def update_discussion(id):
    data = request.get_json(force=True)
    d = Discussion.query.get_or_404(id)
    d.message_utilisateur = data.get('message_utilisateur', d.message_utilisateur)
    d.reponse_bot = data.get('reponse_bot', d.reponse_bot)
    try:
        db.session.commit()
        return jsonify({'message': 'Mis à jour'}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception('Update error:')
        return jsonify({'error': str(e)}), 500

@discussion_bp.route('/discussions/<int:id>', methods=['DELETE'])
def delete_discussion(id):
    d = Discussion.query.get_or_404(id)
    try:
        db.session.delete(d)
        db.session.commit()
        return jsonify({'message': 'Supprimé'}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception('Delete error:')
        return jsonify({'error': str(e)}), 500
