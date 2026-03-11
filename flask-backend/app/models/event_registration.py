from datetime import datetime
from app.config.database import get_db
from bson import ObjectId

class EventRegistration:
    collection = None
    
    @classmethod
    def get_collection(cls):
        if cls.collection is None:
            db = get_db()
            cls.collection = db.eventregistrations
        return cls.collection
    
    @classmethod
    def create(cls, data):
        collection = cls.get_collection()
        data['created_at'] = datetime.utcnow()
        if 'status' not in data:
            data['status'] = 'pending'
        result = collection.insert_one(data)
        return result.inserted_id
    
    @classmethod
    def find(cls, query=None):
        collection = cls.get_collection()
        if query:
            return list(collection.find(query))
        return list(collection.find())
    
    @classmethod
    def find_one(cls, query):
        collection = cls.get_collection()
        return collection.find_one(query)
    
    @classmethod
    def update_by_id(cls, id, update_data):
        collection = cls.get_collection()
        return collection.update_one({'_id': ObjectId(id)}, {'$set': update_data})
    
    @classmethod
    def count_by_event(cls, event_id):
        collection = cls.get_collection()
        return collection.count_documents({'eventId': ObjectId(event_id)})