from datetime import datetime
from app.config.database import get_db
from bson import ObjectId

class Team:
    collection = None
    
    @classmethod
    def get_collection(cls):
        if cls.collection is None:
            db = get_db()
            cls.collection = db.teams
        return cls.collection
    
    @classmethod
    def create(cls, data):
        collection = cls.get_collection()
        data['created_at'] = datetime.utcnow()
        result = collection.insert_one(data)
        return result.inserted_id
    
    @classmethod
    def find(cls, query=None):
        collection = cls.get_collection()
        if query:
            return list(collection.find(query))
        return list(collection.find())
    
    @classmethod
    def find_by_id(cls, id):
        collection = cls.get_collection()
        return collection.find_one({'_id': ObjectId(id)})
    
    @classmethod
    def update_by_id(cls, id, update_data):
        collection = cls.get_collection()
        return collection.update_one({'_id': ObjectId(id)}, {'$set': update_data})
    
    @classmethod
    def delete_by_id(cls, id):
        collection = cls.get_collection()
        return collection.delete_one({'_id': ObjectId(id)})