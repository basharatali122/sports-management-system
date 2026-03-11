from flask_socketio import emit, join_room
from app import socketio
from app.models.chat import Chat
from bson import ObjectId

def initialize_socketio():
    @socketio.on('connect')
    def handle_connect():
        print('Client connected')

    @socketio.on('joinChat')
    def handle_join_chat(data):
        name = data.get('name')
        user_id = data.get('userId')
        request_id = data.get('requestId')
        
        room_id = '_'.join(sorted([user_id, request_id]))
        print(f"{name} joined room: {room_id}")
        join_room(room_id)

    @socketio.on('sendMessage')
    def handle_send_message(data):
        name = data.get('name')
        user_id = data.get('userId')
        request_id = data.get('requestId')
        text = data.get('text')
        
        room_id = '_'.join(sorted([user_id, request_id]))
        print(f"{name}: {text}")

        try:
            # Find or create chat
            chat = Chat.find_or_create([user_id, request_id])
            
            # Add message
            message_data = {
                'senderId': user_id,
                'text': text
            }
            Chat.add_message(chat['_id'], message_data)
            
            # Emit to room
            emit('messageReceived', {
                'name': name,
                'text': text,
                'senderId': user_id
            }, room=room_id)
            
        except Exception as e:
            print(f"Error saving message to database: {e}")

    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')