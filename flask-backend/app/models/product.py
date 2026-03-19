from datetime import datetime
from app.config.database import get_db
from bson import ObjectId

class Product:
    collection = None
    
    @classmethod
    def get_collection(cls):
        if cls.collection is None:
            db = get_db()
            cls.collection = db.products
        return cls.collection
    
    @classmethod
    def create(cls, data):
        collection = cls.get_collection()
        
        if 'created_at' not in data:
            data['created_at'] = datetime.utcnow()
        if 'stock' not in data:
            data['stock'] = 0
            
        result = collection.insert_one(data)
        return result.inserted_id
    
    @classmethod
    def find_one(cls, query):
        collection = cls.get_collection()
        return collection.find_one(query)
    
    @classmethod
    def find(cls, query=None, sort=None, limit=0, skip=0):
        collection = cls.get_collection()
        if query is None:
            query = {}
        
        cursor = collection.find(query)
        if sort:
            cursor = cursor.sort(sort)
        if skip:
            cursor = cursor.skip(skip)
        if limit:
            cursor = cursor.limit(limit)
            
        return list(cursor)
    
    @classmethod
    def find_by_id(cls, id):
        collection = cls.get_collection()
        return collection.find_one({'_id': ObjectId(id)})
    
    @classmethod
    def update_by_id(cls, id, update_data):
        collection = cls.get_collection()
        return collection.update_one(
            {'_id': ObjectId(id)}, 
            {'$set': update_data}
        )
    
    @classmethod
    def delete_by_id(cls, id):
        collection = cls.get_collection()
        return collection.delete_one({'_id': ObjectId(id)})
    
    @classmethod
    def update_stock(cls, product_id, quantity_change):
        """Update product stock (positive for increase, negative for decrease)"""
        collection = cls.get_collection()
        return collection.update_one(
            {'_id': ObjectId(product_id)},
            {'$inc': {'stock': quantity_change}}
        )