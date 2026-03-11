# from flask import Blueprint
# from app.controllers.chat_controller import get_or_create_chat
# from app.middleware.auth import auth

# chat_bp = Blueprint('chat', __name__)

# @chat_bp.route('/chat/<request_id>', methods=['GET'])
# @auth
# def chat_route(request_id):
#     return get_or_create_chat(request_id)


from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.chat_controller import get_or_create_chat

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat/<request_id>', methods=['GET'])
@jwt_required()
def chat_route(request_id):
    """Get or create chat - protected route"""
    return get_or_create_chat(request_id)