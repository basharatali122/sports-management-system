from datetime import datetime
from app.config.database import get_db
from bson import ObjectId

class Cart:
    collection = None
    
    @classmethod
    def get_collection(cls):
        if cls.collection is None:
            db = get_db()
            cls.collection = db.carts
        return cls.collection
    
    @classmethod
    def create(cls, data):
        collection = cls.get_collection()
        
        if 'created_at' not in data:
            data['created_at'] = datetime.utcnow()
        if 'items' not in data:
            data['items'] = []
            
        result = collection.insert_one(data)
        return result.inserted_id
    
    @classmethod
    def find_by_user(cls, user_id):
        collection = cls.get_collection()
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        return collection.find_one({'user_id': user_id})
    
    @classmethod
    def create_or_update(cls, user_id, items):
        collection = cls.get_collection()
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        result = collection.update_one(
            {'user_id': user_id},
            {'$set': {'items': items, 'updated_at': datetime.utcnow()}},
            upsert=True
        )
        return result
    
    @classmethod
    def add_item(cls, user_id, product_id, quantity=1):
        collection = cls.get_collection()
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        if isinstance(product_id, str):
            product_id = ObjectId(product_id)
            
        # Check if cart exists
        cart = cls.find_by_user(user_id)
        
        if not cart:
            # Create new cart with item
            return cls.create({
                'user_id': user_id,
                'items': [{
                    'product_id': product_id,
                    'quantity': quantity,
                    'added_at': datetime.utcnow()
                }]
            })
        
        # Check if product already in cart
        item_exists = False
        for item in cart['items']:
            if item['product_id'] == product_id:
                item['quantity'] += quantity
                item_exists = True
                break
        
        if not item_exists:
            cart['items'].append({
                'product_id': product_id,
                'quantity': quantity,
                'added_at': datetime.utcnow()
            })
        
        # Update cart
        collection.update_one(
            {'user_id': user_id},
            {'$set': {'items': cart['items'], 'updated_at': datetime.utcnow()}}
        )
        
        return cart
    
    @classmethod
    def remove_item(cls, user_id, product_id):
        collection = cls.get_collection()
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        if isinstance(product_id, str):
            product_id = ObjectId(product_id)
            
        result = collection.update_one(
            {'user_id': user_id},
            {'$pull': {'items': {'product_id': product_id}}}
        )
        return result.modified_count > 0
    
    @classmethod
    def update_item_quantity(cls, user_id, product_id, quantity):
        collection = cls.get_collection()
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        if isinstance(product_id, str):
            product_id = ObjectId(product_id)
            
        result = collection.update_one(
            {'user_id': user_id, 'items.product_id': product_id},
            {'$set': {'items.$.quantity': quantity}}
        )
        return result.modified_count > 0
    
    @classmethod
    def clear_cart(cls, user_id):
        collection = cls.get_collection()
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        result = collection.update_one(
            {'user_id': user_id},
            {'$set': {'items': []}}
        )
        return result.modified_count > 0