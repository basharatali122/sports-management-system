# from flask import Blueprint, jsonify
# from app.middleware.auth import auth

# profile_bp = Blueprint('profile', __name__)

# @profile_bp.route('/getProfile', methods=['GET'])
# @auth
# def get_profile():
#     try:
#         return jsonify(request.user), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400



from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/getProfile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        
        # Fetch user from database
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Remove sensitive data
        if 'password' in user:
            del user['password']
        
        # Convert ObjectId to string
        user['_id'] = str(user['_id'])
        
        return jsonify(user), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400