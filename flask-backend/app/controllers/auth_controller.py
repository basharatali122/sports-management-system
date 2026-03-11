from flask import request, jsonify, make_response
from app.models.user import User
from app.utils.jwt import generate_tokens
from app.response_handler import response_handler
import bcrypt
import os
from datetime import datetime

def login_user():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password')
        
        if not email or not password:
            return response_handler(
                error="Email and password are required",
                status_code=400
            )
        
        # Find user
        user = User.find_one({'email': email})
        if not user:
            return response_handler(error="Invalid credentials", status_code=401)
        
        # Check approvals based on role
        if user.get('role') == 'coach' and not user.get('approved', False):
            return response_handler(
                error="Coach account pending approval",
                status_code=403
            )
        
        if user.get('role') == 'participant' and not user.get('approvedByCoach', True):
            return response_handler(
                error="Participant account pending coach approval",
                status_code=403
            )
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return response_handler(error="Invalid credentials", status_code=401)
        
        # Generate tokens
        tokens = generate_tokens(
            str(user['_id']),
            user['role'],
            user['email'],
            user['name']
        )
        
        # Prepare user data for response
        user_data = {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'approved': user.get('approved', False),
            'approvedByCoach': user.get('approvedByCoach', True),
            'sport': user.get('sport')
        }
        
        # Create response with cookie
        resp = make_response(
            response_handler(data={
                'token': tokens['access_token'],
                'user': user_data
            })
        )
        
        # Set cookie
        resp.set_cookie(
            'access_token_cookie',
            tokens['access_token'],
            max_age=3600,  # 1 hour
            httponly=True,
            samesite='Lax',
            path='/'
        )
        
        return resp
        
    except Exception as e:
        print(f"Login error: {e}")
        return response_handler(error="Something went wrong, try again.", status_code=500)

def logout_user():
    try:
        resp = make_response(response_handler(data={'message': 'Logout successful'}))
        resp.delete_cookie('auth')
        return resp
    except Exception as e:
        print(f"Logout error: {e}")
        return response_handler(error="Error logging out", status_code=500)