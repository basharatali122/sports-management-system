
from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.user_controller import get_all_users
from app.middleware.auth import role

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/getUsers', methods=['GET'])
@jwt_required()
@role('admin')

def get_users_route():
    """Get all users - Admin only"""
    return get_all_users()