from flask import Blueprint, request, jsonify
from app.models import db, Events
import uuid
from datetime import datetime

event_bp = Blueprint('event', __name__)

# Créer un événement
@event_bp.route('/events', methods=['POST'])
def create_event():
    data = request.json
    try:
        event = Events(
            title=data['title'],
            description=data.get('description'),
            start_time=datetime.fromisoformat(data['start']),
            end_time=datetime.fromisoformat(data['end']),
            user_id=data['user_id']
        )

        db.session.add(event)
        db.session.commit()
        return jsonify({'message': 'Événement créé avec succès', 'event_id': event.id}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erreur lors de la création de l'événement: {str(e)}")  # Ajout du print pour débogage
        return jsonify({'error': str(e)}), 400

# Récupérer les événements d'un utilisateur
@event_bp.route('/events/<user_id>', methods=['GET'])
def get_events(user_id):
    try:
        events = Events.query.all()
        result = [{
            'id': e.id,
            'title': e.title,
            'description': e.description,
            'start': e.start_time.isoformat(),
            'end': e.end_time.isoformat()
        } for e in events]
        return jsonify(result), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des événements pour l'utilisateur {user_id}: {str(e)}")  # Print pour débogage
        return jsonify({'error': str(e)}), 400

# Récupérer un événement spécifique
@event_bp.route('/events/<user_id>/<event_id>', methods=['GET'])
def get_event(user_id, event_id):
    try:
        event = Events.query.filter_by(id=event_id, user_id=user_id).first()
        if not event:
            return jsonify({'error': 'Événement non trouvé'}), 404
        result = {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'start': event.start_time.isoformat(),
            'end': event.end_time.isoformat()
        }
        return jsonify(result), 200
    except Exception as e:
        print(f"Erreur lors de la récupération de l'événement {event_id} pour l'utilisateur {user_id}: {str(e)}")  # Print pour débogage
        return jsonify({'error': str(e)}), 400

# Mettre à jour un événement
@event_bp.route('/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.json
    try:
        event = Events.query.get(event_id)
        if not event:
            return jsonify({'error': 'Événement non trouvé'}), 404

        event.title = data.get('title', event.title)
        event.description = data.get('description', event.description)
        if 'start' in data:
            event.start_time = datetime.fromisoformat(data['start'])
        if 'end' in data:
            event.end_time = datetime.fromisoformat(data['end'])

        db.session.commit()
        return jsonify({'message': 'Événement mis à jour avec succès'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Erreur lors de la mise à jour de l'événement {event_id}: {str(e)}")  # Print pour débogage
        return jsonify({'error': str(e)}), 400

# Supprimer un événement
@event_bp.route('/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        event = Events.query.get(event_id)
        if not event:
            return jsonify({'error': 'Événement non trouvé'}), 404

        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': 'Événement supprimé avec succès'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Erreur lors de la suppression de l'événement {event_id}: {str(e)}")  # Print pour débogage
        return jsonify({'error': str(e)}), 400
