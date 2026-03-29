
from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.sports_category_controller import *
from app.middleware.auth import role

sport_category_bp = Blueprint('sport_categories', __name__)

# ========== PUBLIC ROUTES ==========
@sport_category_bp.route('', methods=['GET'])
def get_categories_route():
    """Get all sport categories - public"""
    return get_categories()

# ========== PROTECTED ROUTES ==========
@sport_category_bp.route('/', methods=['POST'])
@jwt_required()
@role('admin')
def create_category_route():
    """Create sport category - admin only"""
    return create_category()

@sport_category_bp.route('/<category_id>/assign-organizer', methods=['PUT'])
@jwt_required()
@role('admin')
def assign_organizer_route(category_id):
    """Assign organizer to category - admin only"""
    return assign_organizer(category_id)

@sport_category_bp.route('/<category_id>', methods=['DELETE'])
@jwt_required()
@role('admin')
def delete_category_route(category_id):
    """Delete sport category - admin only"""
    return delete_category(category_id)