
from flask import Blueprint
from app.controllers.auth_controller import login_user, logout_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login - public route"""
    return login_user()

@auth_bp.route('/logout', methods=['GET'])
def logout():
    """User logout - public route"""
    return logout_user()