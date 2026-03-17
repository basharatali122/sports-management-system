from datetime import datetime
from app.config.database import get_db
from bson import ObjectId

class Notification:
    collection = None
    
    @classmethod
    def get_collection(cls):
        if cls.collection is None:
            db = get_db()
            cls.collection = db.notifications
        return cls.collection
    
    @classmethod
    def create(cls, data):
        collection = cls.get_collection()
        
        if 'created_at' not in data:
            data['created_at'] = datetime.utcnow()
        if 'isRead' not in data:
            data['isRead'] = False
        if 'type' not in data:
            data['type'] = 'general'
            
        result = collection.insert_one(data)
        return result.inserted_id
    
    @classmethod
    def find_by_user(cls, user_id, limit=50, skip=0, unread_only=False):
        collection = cls.get_collection()
        
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        query = {'userId': user_id}
        if unread_only:
            query['isRead'] = False
        
        notifications = list(collection.find(query)
                           .sort('created_at', -1)
                           .skip(skip)
                           .limit(limit))
        
        return notifications
    
    @classmethod
    def find_by_id(cls, notification_id):
        collection = cls.get_collection()
        
        if isinstance(notification_id, str):
            notification_id = ObjectId(notification_id)
            
        return collection.find_one({'_id': notification_id})
    
    @classmethod
    def mark_as_read(cls, notification_id, user_id):
        collection = cls.get_collection()
        
        if isinstance(notification_id, str):
            notification_id = ObjectId(notification_id)
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        result = collection.update_one(
            {'_id': notification_id, 'userId': user_id},
            {'$set': {'isRead': True}}
        )
        
        return result.modified_count > 0
    
    @classmethod
    def mark_all_as_read(cls, user_id):
        collection = cls.get_collection()
        
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        result = collection.update_many(
            {'userId': user_id, 'isRead': False},
            {'$set': {'isRead': True}}
        )
        
        return result.modified_count
    
    @classmethod
    def delete_notification(cls, notification_id, user_id):
        collection = cls.get_collection()
        
        if isinstance(notification_id, str):
            notification_id = ObjectId(notification_id)
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        result = collection.delete_one(
            {'_id': notification_id, 'userId': user_id}
        )
        
        return result.deleted_count > 0
    
    @classmethod
    def create_admin_notification(cls, user_id, title, message, notification_type='admin'):
        """Create notification for admin message"""
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        return cls.create({
            'userId': user_id,
            'title': title,
            'message': message,
            'type': notification_type,
            'isRead': False
        })
    
    @classmethod
    def get_unread_count(cls, user_id):
        """Get unread notification count for a user"""
        collection = cls.get_collection()
        
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        return collection.count_documents({
            'userId': user_id,
            'isRead': False
        })