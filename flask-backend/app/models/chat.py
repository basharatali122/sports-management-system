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
    def create(cls, data):
        collection = cls.get_collection()
        
        if 'created_at' not in data:
            data['created_at'] = datetime.utcnow()
        if 'isRead' not in data:
            data['isRead'] = False
            
        result = collection.insert_one(data)
        return result.inserted_id
    
    @classmethod
    def find_by_id(cls, id):
        collection = cls.get_collection()
        return collection.find_one({'_id': ObjectId(id)})
    
    @classmethod
    def find_conversation(cls, user1_id, user2_id, limit=50, skip=0):
        """Find messages between two users"""
        collection = cls.get_collection()
        
        # Convert to ObjectId if strings
        if isinstance(user1_id, str):
            user1_id = ObjectId(user1_id)
        if isinstance(user2_id, str):
            user2_id = ObjectId(user2_id)
        
        query = {
            '$or': [
                {'sender': user1_id, 'receiver': user2_id},
                {'sender': user2_id, 'receiver': user1_id}
            ]
        }
        
        messages = list(collection.find(query)
                       .sort('created_at', -1)
                       .skip(skip)
                       .limit(limit))
        
        return messages
    
    @classmethod
    def mark_messages_as_read(cls, sender_id, receiver_id):
        """Mark all messages from sender to receiver as read"""
        collection = cls.get_collection()
        
        if isinstance(sender_id, str):
            sender_id = ObjectId(sender_id)
        if isinstance(receiver_id, str):
            receiver_id = ObjectId(receiver_id)
        
        result = collection.update_many(
            {
                'sender': sender_id,
                'receiver': receiver_id,
                'isRead': False
            },
            {'$set': {'isRead': True}}
        )
        
        return result.modified_count
    
    @classmethod
    def get_unread_count(cls, user_id):
        """Get total unread messages for a user"""
        collection = cls.get_collection()
        
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        count = collection.count_documents({
            'receiver': user_id,
            'isRead': False
        })
        
        return count
    
    @classmethod
    def get_recent_conversations(cls, user_id, limit=20):
        """Get list of users the current user has chatted with, with last message"""
        collection = cls.get_collection()
        
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        # Aggregation pipeline to get latest message per conversation
        pipeline = [
            {
                '$match': {
                    '$or': [
                        {'sender': user_id},
                        {'receiver': user_id}
                    ]
                }
            },
            {'$sort': {'created_at': -1}},
            {
                '$group': {
                    '_id': {
                        '$cond': [
                            {'$eq': ['$sender', user_id]},
                            '$receiver',
                            '$sender'
                        ]
                    },
                    'last_message': {'$first': '$$ROOT'},
                    'unread_count': {
                        '$sum': {
                            '$cond': [
                                {'$and': [
                                    {'$eq': ['$receiver', user_id]},
                                    {'$eq': ['$isRead', False]}
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {'$limit': limit}
        ]
        
        conversations = list(collection.aggregate(pipeline))
        return conversations