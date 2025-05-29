from flask import Flask, render_template, url_for, session, redirect, request, flash
from authlib.integrations.flask_client import OAuth
from urllib.parse import quote_plus, urlencode
import secrets
from pymongo import MongoClient
import bcrypt

mongo_client = MongoClient("mongodb://admin:secret@localhost:27018/custom_app_db?authSource=admin")
mongo_db = mongo_client["custom_app_db"]
users_collection = mongo_db["users"]


app = Flask(__name__)

# Configuration
app.secret_key = secrets.token_hex(16)
app.config.from_mapping(
    OAUTH2_CLIENT_ID="flask-client",
    OAUTH2_CLIENT_SECRET="iWJ843kdbFqJveMrgFBY48Qg9hm0APAI",
    OAUTH2_ISSUER="http://localhost:8080/realms/auth-realm",
    FLASK_PORT=5000
)

# OAuth Configuration
oauth = OAuth(app)
oauth.register(
    name="keycloak",
    client_id=app.config["OAUTH2_CLIENT_ID"],
    client_secret=app.config["OAUTH2_CLIENT_SECRET"],
    client_kwargs={"scope": "openid profile email"},
    server_metadata_url=f"{app.config['OAUTH2_ISSUER']}/.well-known/openid-configuration",
    authorize_url=f"{app.config['OAUTH2_ISSUER']}/protocol/openid-connect/auth",
    access_token_url=f"{app.config['OAUTH2_ISSUER']}/protocol/openid-connect/token",
)

# Routes
@app.route("/")
def home():
    if "user" in session:
        return redirect(url_for("dashboard"))
    return render_template("index.html")

@app.route("/login")
def login():
    # Page de login personnalisée qui redirige vers Keycloak
    return render_template("login.html")

@app.route("/auth/keycloak")
def auth_keycloak():
    redirect_uri = url_for("auth_callback", _external=True)
    return oauth.keycloak.authorize_redirect(redirect_uri)

@app.route("/auth/callback")
def auth_callback():
    try:
        token = oauth.keycloak.authorize_access_token()
        session["user"] = token
        return redirect(url_for("dashboard"))
    except Exception as e:
        flash("Échec de l'authentification", "error")
        return redirect(url_for("login"))

@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("login"))
    
    user_info = session["user"].get("userinfo", {})
    return render_template("dashboard.html", 
                         username=user_info.get("preferred_username"),
                         email=user_info.get("email"))

@app.route("/logout")
def logout():
    if "user" not in session:
        return redirect(url_for("home"))
    
    id_token = session["user"].get("id_token")
    session.clear()
    
    if id_token:
        logout_url = (
            f"{app.config['OAUTH2_ISSUER']}/protocol/openid-connect/logout?"
            f"post_logout_redirect_uri={quote_plus('http://localhost:5000/logged-out')}"
            f"&id_token_hint={id_token}"
        )
        return redirect(logout_url)
    
    return redirect(url_for("logged_out"))

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        role = request.form["role"]

        # Vérifier si l'utilisateur existe déjà
        if users_collection.find_one({"username": username}):
            flash("Nom d'utilisateur déjà pris", "error")
            return redirect(url_for("signup"))

        # Hasher le mot de passe
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Enregistrer l'utilisateur
        users_collection.insert_one({
            "username": username,
            "password": hashed_password,
            "role": role
        })

        flash("Inscription réussie. Vous pouvez maintenant vous connecter.", "success")
        return redirect(url_for("login"))

    return render_template("signup.html")


@app.route("/logged-out")
def logged_out():
    return render_template("loggedout.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=app.config["FLASK_PORT"], debug=True)