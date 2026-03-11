from flask import request
from app.models.chat import Chat
from app.response_handler import response_handler
from bson import ObjectId

def get_or_create_chat(request_id):
    try:
        user_id = request.user['_id']
        
        # Find or create chat
        chat = Chat.find_or_create([user_id, request_id])
        
        # Format response
        chat['_id'] = str(chat['_id'])
        chat['participants'] = [str(p) for p in chat['participants']]
        
        # Format messages
        formatted_messages = []
        for msg in chat.get('messages', []):
            msg['_id'] = str(msg.get('_id')) if msg.get('_id') else None
            msg['senderId'] = str(msg['senderId'])
            formatted_messages.append(msg)
        chat['messages'] = formatted_messages
        
        return response_handler(data=chat)
        
    except Exception as e:
        print(f"Chat error: {e}")
        return response_handler(error=str(e), status_code=500)