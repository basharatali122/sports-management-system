from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from datetime import timedelta
import os

def generate_tokens(user_id, role, email, name):
    """Generate access and refresh tokens"""
    access_token = create_access_token(
        identity=str(user_id),
        additional_claims={
            'role': role,
            'email': email,
            'name': name
        },
        expires_delta=timedelta(hours=1)
    )
    
    refresh_token = create_refresh_token(
        identity=str(user_id),
        expires_delta=timedelta(days=7)
    )
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }

def get_current_user():
    """Get current user from JWT token"""
    return get_jwt_identity()