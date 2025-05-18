from app import create_app

# Crée l'application
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006)  # Assure-toi que Flask tourne sur le bon port
