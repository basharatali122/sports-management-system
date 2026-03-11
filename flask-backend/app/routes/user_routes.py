# from flask import Blueprint, request, jsonify
# from app.controllers.user_controller import *
# from app.middleware.auth import auth, role

# user_bp = Blueprint('users', __name__)

# # Public routes
# user_bp.route('/getAllUsers', methods=['GET'])(get_all_users)
# user_bp.route('/getAllCoaches', methods=['GET'])(get_all_coaches)
# user_bp.route('/getAllparticipant', methods=['GET'])(get_all_participants)
# user_bp.route('/admin-check', methods=['GET'])(admin_check)
# user_bp.route('/create', methods=['POST'])(create_user)
# user_bp.route('/organizers', methods=['GET'])(get_organizers)
# user_bp.route('/getUserById/<user_id>', methods=['GET'])(get_user_by_id)
# user_bp.route('/updateUser/<user_id>', methods=['PUT'])(update_user)

# # Protected routes
# @user_bp.route('/profile/getProfile', methods=['GET'])
# @auth
# def get_profile_route():
#     return get_profile()

# @user_bp.route('/profile/updateProfile', methods=['PUT'])
# @auth
# def update_profile_route():
#     return update_profile()

# @user_bp.route('/<user_id>/approve', methods=['PATCH'])
# @auth
# @role('admin')
# def approve_user_route(user_id):
#     return approve_user(user_id)

# @user_bp.route('/<user_id>/reject', methods=['DELETE'])
# @auth
# @role('admin')
# def reject_user_route(user_id):
#     return reject_user(user_id)

# @user_bp.route('/me', methods=['GET'])
# @auth
# def get_me():
#     try:
#         return jsonify(request.user), 200
#     except Exception as e:
#         return jsonify({'message': 'Server error'}), 500




from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.user_controller import *
from app.middleware.auth import role

user_bp = Blueprint('users', __name__)

# ========== PUBLIC ROUTES ==========
@user_bp.route('/getAllUsers', methods=['GET'])
def get_all_users_route():
    """Get all users - public"""
    return get_all_users()

@user_bp.route('/getAllCoaches', methods=['GET'])
def get_all_coaches_route():
    """Get all coaches - public"""
    return get_all_coaches()

@user_bp.route('/getAllparticipant', methods=['GET'])
def get_all_participants_route():
    """Get all participants - public"""
    return get_all_participants()

@user_bp.route('/admin-check', methods=['GET'])
def admin_check_route():
    """Check if admin exists - public"""
    return admin_check()

@user_bp.route('/create', methods=['POST'])
def create_user_route():
    """Create new user - public registration"""
    return create_user()

@user_bp.route('/organizers', methods=['GET'])
def get_organizers_route():
    """Get organizers - public"""
    return get_organizers()

@user_bp.route('/getUserById/<user_id>', methods=['GET'])
def get_user_by_id_route(user_id):
    """Get user by ID - public"""
    return get_user_by_id(user_id)

@user_bp.route('/updateUser/<user_id>', methods=['PUT'])
def update_user_route(user_id):
    """Update user - public (consider adding auth)"""
    return update_user(user_id)

# ========== PROTECTED ROUTES ==========
@user_bp.route('/profile/getProfile', methods=['GET'])
@jwt_required()
def get_profile_route():
    """Get current user profile"""
    return get_profile()

@user_bp.route('/profile/updateProfile', methods=['PUT'])
@jwt_required()
def update_profile_route():
    """Update current user profile"""
    return update_profile()

@user_bp.route('/<user_id>/approve', methods=['PATCH'])
@jwt_required()
@role('admin','coach')
def approve_user_route(user_id):
    """Approve user - admin only"""
    return approve_user(user_id)

@user_bp.route('/<user_id>/reject', methods=['DELETE'])
@jwt_required()
@role('admin','coach')
def reject_user_route(user_id):
    """Reject user - admin only"""
    return reject_user(user_id)

@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """Get current user info"""
    try:
        # Get user ID from JWT
        user_id = get_jwt_identity()
        
        # Fetch user from database
        from app.models.user import User
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Convert ObjectId to string and remove password
        user['_id'] = str(user['_id'])
        if 'password' in user:
            del user['password']
            
        return jsonify(user), 200
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500