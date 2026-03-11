from datetime import datetime
from app.config.database import get_db
from bson import ObjectId

class Chat:
    collection = None
    
    @classmethod
    def get_collection(cls):
        if cls.collection is None:
            db = get_db()
            cls.collection = db.chats
        return cls.collection
    
    @classmethod
    def find_or_create(cls, participants):
        collection = cls.get_collection()
        # Sort participants to ensure consistent ordering
        sorted_participants = sorted([ObjectId(p) for p in participants])
        
        chat = collection.find_one({'participants': sorted_participants})
        
        if not chat:
            chat_data = {
                'participants': sorted_participants,
                'messages': [],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            result = collection.insert_one(chat_data)
            chat = collection.find_one({'_id': result.inserted_id})
        
        return chat
    
    @classmethod
    def add_message(cls, chat_id, message_data):
        collection = cls.get_collection()
        message = {
            'senderId': ObjectId(message_data['senderId']),
            'text': message_data['text'],
            'created_at': datetime.utcnow()
        }
        return collection.update_one(
            {'_id': ObjectId(chat_id)},
            {
                '$push': {'messages': message},
                '$set': {'updated_at': datetime.utcnow()}
            }
        )
    
    @classmethod
    def find_by_participants(cls, user1_id, user2_id):
        collection = cls.get_collection()
        return collection.find_one({
            'participants': {
                '$all': [ObjectId(user1_id), ObjectId(user2_id)]
            }
        })