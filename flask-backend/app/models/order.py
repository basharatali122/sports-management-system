from datetime import datetime
from app.config.database import get_db
from bson import ObjectId

class Order:
    collection = None
    
    @classmethod
    def get_collection(cls):
        if cls.collection is None:
            db = get_db()
            cls.collection = db.orders
        return cls.collection
    
    @classmethod
    def create(cls, data):
        collection = cls.get_collection()
        
        if 'created_at' not in data:
            data['created_at'] = datetime.utcnow()
        if 'order_status' not in data:
            data['order_status'] = 'pending'
        if 'payment_status' not in data:
            data['payment_status'] = 'pending'
            
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
    def find_by_user(cls, user_id, limit=50, skip=0):
        collection = cls.get_collection()
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        return list(collection.find({'user_id': user_id})
                   .sort('created_at', -1)
                   .skip(skip)
                   .limit(limit))
    
    @classmethod
    def update_by_id(cls, id, update_data):
        collection = cls.get_collection()
        return collection.update_one(
            {'_id': ObjectId(id)}, 
            {'$set': update_data}
        )
    
    @classmethod
    def update_status(cls, order_id, order_status, payment_status=None):
        collection = cls.get_collection()
        update_data = {'order_status': order_status}
        if payment_status:
            update_data['payment_status'] = payment_status
            
        return collection.update_one(
            {'_id': ObjectId(order_id)},
            {'$set': update_data}
        )
    
    @classmethod
    def get_order_stats(cls):
        """Get order statistics for admin dashboard"""
        collection = cls.get_collection()
        
        pipeline = [
            {
                '$group': {
                    '_id': '$order_status',
                    'count': {'$sum': 1},
                    'total': {'$sum': '$total_amount'}
                }
            }
        ]
        
        return list(collection.aggregate(pipeline))