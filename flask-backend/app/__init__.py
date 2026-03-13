
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize SocketIO
socketio = SocketIO(cors_allowed_origins="http://localhost:5173")

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET', 'your-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('SECRET', 'your-jwt-secret')
    
    # 🔥 CRITICAL JWT CONFIGURATIONS
    app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']  # Check both
    app.config['JWT_HEADER_NAME'] = 'Authorization'            # Header name
    app.config['JWT_HEADER_TYPE'] = 'Bearer'                   # Header type
    app.config['JWT_COOKIE_NAME'] = 'access_token_cookie'      # Cookie name
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False              # Disable CSRF for dev
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600              # 1 hour
    
    # Initialize extensions
    CORS(app, 
         origins=["http://localhost:5173"], 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],      # Allow Authorization header
         expose_headers=["Content-Type", "Authorization"])
    
    jwt = JWTManager(app)
    
    # Import and register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.event_routes import event_bp
    from app.routes.team_routes import team_bp
    from app.routes.sport_category_routes import sport_category_bp
    # from app.routes.profile_routes import profile_bp
    from app.routes.chat_routes import chat_bp
    from app.routes.profile_routes import profile_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(event_bp, url_prefix='/events')
    app.register_blueprint(team_bp, url_prefix='/team')
    app.register_blueprint(sport_category_bp, url_prefix='/sport-categories')
    app.register_blueprint(profile_bp, url_prefix="/profiles")
    app.register_blueprint(chat_bp, url_prefix='/')
    
    # Initialize SocketIO with app
    socketio.init_app(app)
    
    # Root route
    @app.route('/')
    def welcome():
        return jsonify({"message": "welcome"})
    
    # Database connection
    from app.config.database import connect_db
    connect_db()
    
    return app