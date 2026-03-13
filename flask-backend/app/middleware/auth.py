
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