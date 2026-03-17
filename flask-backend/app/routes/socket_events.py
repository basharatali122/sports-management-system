from flask import request
from flask_socketio import join_room, leave_room, emit
from flask_jwt_extended import decode_token
from bson import ObjectId
import jwt
import os
from datetime import datetime

from app import socketio
from app.models.user import User
from app.models.chat import Chat

# Store online users
online_users = {}

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    try:
        # Get token from query string
        token = request.args.get('token')
        
        if not token:
            print("No token provided for socket connection")
            return False
        
        # Decode token
        try:
            decoded = decode_token(token)
            user_id = decoded['sub']
        except:
            # Try with jwt directly as fallback
            try:
                secret = os.getenv('SECRET', 'your-jwt-secret')
                decoded = jwt.decode(token, secret, algorithms=['HS256'])
                user_id = decoded['sub']
            except Exception as e:
                print(f"Invalid token for socket connection: {e}")
                return False
        
        # Store user connection
        online_users[user_id] = request.sid
        
        # Join user to their private room
        join_room(f'user_{user_id}')
        
        # Emit online status to friends/contacts
        emit('user_online', {'userId': user_id}, broadcast=True, include_self=False)
        
        print(f"User {user_id} connected")
        return True
        
    except Exception as e:
        print(f"Socket connection error: {e}")
        return False

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    try:
        # Find and remove user
        for user_id, sid in list(online_users.items()):
            if sid == request.sid:
                del online_users[user_id]
                
                # Leave private room
                leave_room(f'user_{user_id}')
                
                # Emit offline status
                emit('user_offline', {'userId': user_id}, broadcast=True, include_self=False)
                
                print(f"User {user_id} disconnected")
                break
                
    except Exception as e:
        print(f"Socket disconnect error: {e}")

@socketio.on('send_message')
def handle_send_message(data):
    """Handle sending message via socket"""
    try:
        sender_id = data.get('senderId')
        receiver_id = data.get('receiverId')
        message_text = data.get('message')
        
        if not sender_id or not receiver_id or not message_text:
            emit('error', {'message': 'Missing required fields'})
            return
        
        # Get sender info
        sender = User.find_by_id(sender_id)
        if not sender:
            emit('error', {'message': 'Sender not found'})
            return
        
        # Create message in database
        message_data = {
            'sender': ObjectId(sender_id),
            'receiver': ObjectId(receiver_id),
            'message': message_text,
            'role': sender['role'],
            'isRead': False,
            'created_at': datetime.utcnow()
        }
        
        message_id = Chat.create(message_data)
        
        # Format for response
        message_data['_id'] = str(message_id)
        message_data['sender'] = sender_id
        message_data['receiver'] = receiver_id
        message_data['created_at'] = message_data['created_at'].isoformat()
        message_data['senderName'] = sender.get('name', 'Unknown')
        
        # Send to receiver if online
        emit(f'private_message_{receiver_id}', {
            'type': 'new_message',
            'message': message_data
        }, room=f'user_{receiver_id}')
        
        # Also send to sender for confirmation
        emit(f'private_message_{sender_id}', {
            'type': 'message_sent',
            'message': message_data
        }, room=f'user_{sender_id}')
        
    except Exception as e:
        print(f"Socket send_message error: {e}")
        import traceback
        traceback.print_exc()
        emit('error', {'message': 'Failed to send message'})

@socketio.on('typing')
def handle_typing(data):
    """Handle typing indicator"""
    try:
        sender_id = data.get('senderId')
        receiver_id = data.get('receiverId')
        is_typing = data.get('isTyping', False)
        
        if not sender_id or not receiver_id:
            return
        
        emit(f'typing_{receiver_id}', {
            'userId': sender_id,
            'isTyping': is_typing
        }, room=f'user_{receiver_id}')
        
    except Exception as e:
        print(f"Socket typing error: {e}")

@socketio.on('mark_read')
def handle_mark_read(data):
    """Handle message read receipt"""
    try:
        reader_id = data.get('readerId')
        sender_id = data.get('senderId')
        
        if not reader_id or not sender_id:
            return
        
        # Mark messages as read in database
        Chat.mark_messages_as_read(sender_id, reader_id)
        
        # Notify sender
        emit(f'private_message_{sender_id}', {
            'type': 'messages_read',
            'readerId': reader_id
        }, room=f'user_{sender_id}')
        
    except Exception as e:
        print(f"Socket mark_read error: {e}")

@socketio.on('join_chat')
def handle_join_chat(data):
    """Join a specific chat room (for group chats)"""
    try:
        user_id = data.get('userId')
        chat_id = data.get('chatId')
        
        if not user_id or not chat_id:
            return
        
        # Join room for this specific chat
        room_name = f'chat_{chat_id}'
        join_room(room_name)
        
        emit('joined_chat', {'chatId': chat_id, 'userId': user_id}, room=room_name)
        
    except Exception as e:
        print(f"Socket join_chat error: {e}")

@socketio.on('leave_chat')
def handle_leave_chat(data):
    """Leave a specific chat room"""
    try:
        user_id = data.get('userId')
        chat_id = data.get('chatId')
        
        if not user_id or not chat_id:
            return
        
        room_name = f'chat_{chat_id}'
        leave_room(room_name)
        
        emit('left_chat', {'chatId': chat_id, 'userId': user_id}, room=room_name)
        
    except Exception as e:
        print(f"Socket leave_chat error: {e}")

def get_online_users():
    """Helper to get list of online users"""
    return list(online_users.keys())