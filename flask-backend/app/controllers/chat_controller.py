from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
from datetime import datetime

from app.models.chat import Chat
from app.models.user import User
from app.response_handler import response_handler
from app import socketio

def can_send_message(sender_role, receiver_role):
    """Check if sender can message receiver based on roles"""
    # Admin can message anyone
    if sender_role == 'admin':
        return True
    
    # Coach can message participants and admins
    if sender_role == 'coach':
        return receiver_role in ['participant', 'admin', 'coach']
    
    # Participant can message coaches and admins
    if sender_role == 'participant':
        return receiver_role in ['coach', 'admin', 'participant']
    
    return False

@jwt_required()
def send_message():
    """Send a message to another user"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        receiver_id = data.get('receiverId')
        message_text = data.get('message')
        
        if not receiver_id or not message_text:
            return response_handler(
                error="Receiver ID and message are required",
                status_code=400
            )
        
        # Validate receiver exists
        receiver = User.find_by_id(receiver_id)
        if not receiver:
            return response_handler(
                error="Receiver not found",
                status_code=404
            )
        
        # Get sender info
        sender = User.find_by_id(current_user_id)
        if not sender:
            return response_handler(
                error="Sender not found",
                status_code=404
            )
        
        # Check role-based permissions
        if not can_send_message(sender['role'], receiver['role']):
            return response_handler(
                error="You don't have permission to message this user",
                status_code=403
            )
        
        # Create message
        message_data = {
            'sender': ObjectId(current_user_id),
            'receiver': ObjectId(receiver_id),
            'message': message_text,
            'role': sender['role'],
            'isRead': False,
            'created_at': datetime.utcnow()
        }
        
        message_id = Chat.create(message_data)
        message_data['_id'] = str(message_id)
        message_data['sender'] = str(message_data['sender'])
        message_data['receiver'] = str(message_data['receiver'])
        
        # Add sender name for frontend
        message_data['senderName'] = sender.get('name', 'Unknown')
        
        # Emit to receiver via Socket.IO
        socketio.emit(f'private_message_{receiver_id}', {
            'type': 'new_message',
            'message': message_data
        })
        
        # Also emit to sender's room for multi-tab support
        socketio.emit(f'private_message_{current_user_id}', {
            'type': 'message_sent',
            'message': message_data
        })
        
        return response_handler(
            data=message_data,
            message="Message sent successfully",
            status_code=201
        )
        
    except Exception as e:
        print(f"Error sending message: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to send message",
            status_code=500
        )

@jwt_required()
def get_chat_history():
    """Get chat history with another user"""
    try:
        current_user_id = get_jwt_identity()
        other_user_id = request.args.get('userId')
        limit = int(request.args.get('limit', 50))
        
        if not other_user_id:
            return response_handler(
                error="User ID is required",
                status_code=400
            )
        
        # Validate other user exists
        other_user = User.find_by_id(other_user_id)
        if not other_user:
            return response_handler(
                error="User not found",
                status_code=404
            )
        
        # Get messages
        messages = Chat.find_conversation(
            current_user_id, 
            other_user_id,
            limit=limit
        )
        
        # Format messages
        formatted_messages = []
        for msg in messages:
            msg['_id'] = str(msg['_id'])
            msg['sender'] = str(msg['sender'])
            msg['receiver'] = str(msg['receiver'])
            msg['created_at'] = msg['created_at'].isoformat()
            formatted_messages.append(msg)
        
        # Mark messages as read (messages sent by other user to current user)
        Chat.mark_messages_as_read(other_user_id, current_user_id)
        
        # Emit read receipt
        socketio.emit(f'private_message_{other_user_id}', {
            'type': 'messages_read',
            'readerId': current_user_id
        })
        
        return response_handler(
            data={
                'messages': formatted_messages,
                'user': {
                    '_id': str(other_user['_id']),
                    'name': other_user.get('name'),
                    'role': other_user.get('role'),
                    'email': other_user.get('email')
                }
            },
            message="Chat history fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching chat history: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to fetch chat history",
            status_code=500
        )

@jwt_required()
def mark_messages_read():
    """Mark messages from a specific user as read"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        sender_id = data.get('senderId')
        
        if not sender_id:
            return response_handler(
                error="Sender ID is required",
                status_code=400
            )
        
        count = Chat.mark_messages_as_read(sender_id, current_user_id)
        
        # Emit read receipt
        socketio.emit(f'private_message_{sender_id}', {
            'type': 'messages_read',
            'readerId': current_user_id
        })
        
        return response_handler(
            data={'markedCount': count},
            message="Messages marked as read"
        )
        
    except Exception as e:
        print(f"Error marking messages as read: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to mark messages as read",
            status_code=500
        )

@jwt_required()
def get_conversations():
    """Get list of recent conversations for current user"""
    try:
        current_user_id = get_jwt_identity()
        
        conversations = Chat.get_recent_conversations(current_user_id)
        
        formatted_conversations = []
        for conv in conversations:
            other_user_id = conv['_id']
            other_user = User.find_by_id(other_user_id)
            
            if not other_user:
                continue
            
            # Format last message
            last_msg = conv['last_message']
            last_msg['_id'] = str(last_msg['_id'])
            last_msg['sender'] = str(last_msg['sender'])
            last_msg['receiver'] = str(last_msg['receiver'])
            last_msg['created_at'] = last_msg['created_at'].isoformat()
            
            formatted_conversations.append({
                'user': {
                    '_id': str(other_user['_id']),
                    'name': other_user.get('name'),
                    'role': other_user.get('role'),
                    'email': other_user.get('email')
                },
                'lastMessage': last_msg,
                'unreadCount': conv.get('unread_count', 0)
            })
        
        return response_handler(
            data={'conversations': formatted_conversations},
            message="Conversations fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching conversations: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to fetch conversations",
            status_code=500
        )

@jwt_required()
def get_unread_count():
    """Get total unread messages for current user"""
    try:
        current_user_id = get_jwt_identity()
        
        count = Chat.get_unread_count(current_user_id)
        
        return response_handler(
            data={'unreadCount': count},
            message="Unread count fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching unread count: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to fetch unread count",
            status_code=500
        )