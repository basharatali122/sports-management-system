# from functools import wraps
# from flask import request, jsonify
# from flask_jwt_extended import verify_jwt_in_request, get_jwt
# from app.models.user import User
# from bson import ObjectId

# def auth(f):
#     """Authentication decorator - verifies JWT token and adds user to request"""
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         try:
#             # Verify JWT token
#             verify_jwt_in_request()
#             jwt_data = get_jwt()
            
#             # Get user from token
#             from flask_jwt_extended import get_jwt_identity
#             user_id = get_jwt_identity()
            
#             # Fetch user from database
#             user = User.find_by_id(user_id)
#             if not user:
#                 return jsonify({'error': 'User not found'}), 401
            
#             # Convert ObjectId to string for JSON serialization
#             user['_id'] = str(user['_id'])
            
#             # Attach user to request
#             request.user = user
#             request.user_id = user_id
            
#             return f(*args, **kwargs)
#         except Exception as e:
#             return jsonify({'error': 'Authentication failed', 'message': str(e)}), 401
    
#     return decorated_function

# def role(*allowed_roles):
#     """Role-based authorization decorator"""
#     def decorator(f):
#         @wraps(f)
#         def decorated_function(*args, **kwargs):
#             if not hasattr(request, 'user'):
#                 return jsonify({'error': 'Authentication required'}), 401
            
#             user_role = request.user.get('role')
#             if user_role not in allowed_roles:
#                 return jsonify({'error': 'Access denied. Insufficient permissions.'}), 403
            
#             return f(*args, **kwargs)
#         return decorated_function
#     return decorator



from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt

def role(*allowed_roles):
    """Role-based authorization decorator - works with @jwt_required()"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Get claims from JWT
                claims = get_jwt()
                user_role = claims.get('role')
                
                if not user_role or user_role not in allowed_roles:
                    return jsonify({
                        'error': 'Access denied', 
                        'message': 'Insufficient permissions'
                    }), 403
                
                return f(*args, **kwargs)
                
            except Exception as e:
                return jsonify({
                    'error': 'Authorization failed',
                    'message': str(e)
                }), 403
        
        return decorated_function
    return decorator

# Note: The @auth decorator is no longer needed
# Use @jwt_required() directly from flask_jwt_extended