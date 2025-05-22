from flask import Blueprint, request, Response, stream_with_context, jsonify, current_app
import requests
import json
import threading
from app import db, create_app
from app.models import Discussion

bot_bp = Blueprint('bot_bp', __name__)
OLLAMA_API = "http://localhost:11434/api/generate"

def save_to_db(app, user_id, prompt, buffer):
    # On pousse un contexte d'application dans le thread
    with app.app_context():
        try:
            d = Discussion(
                utilisateur_id=user_id,
                message_utilisateur=prompt,
                reponse_bot=buffer
            )
            db.session.add(d)
            db.session.commit()
        except Exception:
            db.session.rollback()
            current_app.logger.exception("Échec de la sauvegarde en base")

@bot_bp.route('/bot/stream', methods=['GET'])
def stream_chat():
    prompt = request.args.get('prompt')
    user_id = request.args.get('utilisateur_id', type=int)

    if not prompt:
        return jsonify({'error': 'Message requis'}), 400

    payload = {
        "model": "llama3",
        "prompt": prompt,
        "stream": True
    }

    # On capture l'objet app pour le passer au thread
    app = current_app._get_current_object()

    def generate():
        buffer = ""

        # Envoie un ping initial pour que le client réagisse immédiatement
        yield "data: \n\n"

        with requests.post(OLLAMA_API, json=payload, stream=True) as r:
            for line in r.iter_lines(chunk_size=1, decode_unicode=True):
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    chunk = data.get("response", "")
                except json.JSONDecodeError:
                    chunk = line
                buffer += chunk
                yield f"data: {chunk}\n\n"

        # Lancement du thread de sauvegarde
        threading.Thread(
            target=save_to_db,
            args=(app, user_id, prompt, buffer),
            daemon=True
        ).start()

    return Response(stream_with_context(generate()), mimetype='text/event-stream')
