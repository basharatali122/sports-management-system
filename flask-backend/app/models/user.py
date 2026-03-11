# from datetime import datetime
# from app.config.database import get_db
# from bson import ObjectId
# import bcrypt
# import email_validator

# class User:
#     collection = None
    
#     @classmethod
#     def get_collection(cls):
#         if cls.collection is None:
#             db = get_db()
#             cls.collection = db.users
#         return cls.collection
    
#     @classmethod
#     def create(cls, data):
#         collection = cls.get_collection()
        
#         # Hash password
#         if 'password' in data:
#             salt = bcrypt.gensalt()
#             data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), salt)
        
#         # Set defaults
#         if 'role' not in data:
#             data['role'] = 'participant'
#         if 'approved' not in data:
#             data['approved'] = False
#         if 'approvedByCoach' not in data:
#             data['approvedByCoach'] = True
#         if 'accountStatus' not in data:
#             data['accountStatus'] = 'active'
#         if 'approvalStatus' not in data:
#             data['approvalStatus'] = 'pending-coach'
#         if 'status' not in data:
#             data['status'] = 'pending'
#         if 'created_at' not in data:
#             data['created_at'] = datetime.utcnow()
            
#         result = collection.insert_one(data)
#         return result.inserted_id
    
#     @classmethod
#     def find_one(cls, query):
#         collection = cls.get_collection()
#         return collection.find_one(query)
    
#     @classmethod
#     def find(cls, query=None):
#         collection = cls.get_collection()
#         if query:
#             return list(collection.find(query))
#         return list(collection.find())
    
#     @classmethod
#     def find_by_id(cls, id):
#         collection = cls.get_collection()
#         return collection.find_one({'_id': ObjectId(id)})
    
#     @classmethod
#     def update_one(cls, query, update_data):
#         collection = cls.get_collection()
#         return collection.update_one(query, {'$set': update_data})
    
#     @classmethod
#     def update_by_id(cls, id, update_data):
#         collection = cls.get_collection()
#         return collection.update_one({'_id': ObjectId(id)}, {'$set': update_data})
    
#     @classmethod
#     def delete_by_id(cls, id):
#         collection = cls.get_collection()
#         return collection.delete_one({'_id': ObjectId(id)})







# from datetime import datetime
# from app.config.database import get_db
# from bson import ObjectId
# import bcrypt

# class User:
#     collection = None
    
#     @classmethod
#     def get_collection(cls):
#         if cls.collection is None:
#             db = get_db()
#             cls.collection = db.users
#         return cls.collection
    
#     @classmethod
#     def create(cls, data):
#         collection = cls.get_collection()
        
#         # 🔥 FIXED: Check if password needs hashing
#         if 'password' in data:
#             password = data['password']
            
#             # If password is already bytes, use it directly
#             if isinstance(password, bytes):
#                 password_bytes = password
#             # If password is string, encode it
#             else:
#                 password_bytes = password.encode('utf-8')
            
#             # Only hash if it's not already hashed (optional check)
#             # You can add a check here if needed, but for now just hash
#             salt = bcrypt.gensalt()
#             data['password'] = bcrypt.hashpw(password_bytes, salt)
        
#         # Set defaults
#         if 'role' not in data:
#             data['role'] = 'participant'
#         if 'approved' not in data:
#             data['approved'] = False
#         if 'approvedByCoach' not in data:
#             data['approvedByCoach'] = True
#         if 'accountStatus' not in data:
#             data['accountStatus'] = 'active'
#         if 'approvalStatus' not in data:
#             data['approvalStatus'] = 'pending-coach'
#         if 'status' not in data:
#             data['status'] = 'pending'
#         if 'created_at' not in data:
#             data['created_at'] = datetime.utcnow()
            
#         result = collection.insert_one(data)
#         return result.inserted_id
    
#     @classmethod
#     def find_one(cls, query):
#         collection = cls.get_collection()
#         return collection.find_one(query)
    
#     @classmethod
#     def find(cls, query=None):
#         collection = cls.get_collection()
#         if query:
#             return list(collection.find(query))
#         return list(collection.find())
    
#     @classmethod
#     def find_by_id(cls, id):
#         collection = cls.get_collection()
#         return collection.find_one({'_id': ObjectId(id)})
    
#     @classmethod
#     def update_one(cls, query, update_data):
#         collection = cls.get_collection()
#         return collection.update_one(query, {'$set': update_data})
    
#     @classmethod
#     def update_by_id(cls, id, update_data):
#         collection = cls.get_collection()
#         return collection.update_one({'_id': ObjectId(id)}, {'$set': update_data})
    
#     @classmethod
#     def delete_by_id(cls, id):
#         collection = cls.get_collection()
#         return collection.delete_one({'_id': ObjectId(id)})




from datetime import datetime
from app.config.database import get_db
from bson import ObjectId

class User:
    collection = None
    
    @classmethod
    def get_collection(cls):
        if cls.collection is None:
            db = get_db()
            cls.collection = db.users
        return cls.collection
    
    @classmethod
    def create(cls, data):
        collection = cls.get_collection()
        
        # 🔥 REMOVED: Password hashing code - controller handles it!
        
        # Set defaults
        if 'role' not in data:
            data['role'] = 'participant'
        if 'approved' not in data:
            data['approved'] = False
        if 'approvedByCoach' not in data:
            data['approvedByCoach'] = True
        if 'accountStatus' not in data:
            data['accountStatus'] = 'active'
        if 'approvalStatus' not in data:
            data['approvalStatus'] = 'pending-coach'
        if 'status' not in data:
            data['status'] = 'pending'
        if 'created_at' not in data:
            data['created_at'] = datetime.utcnow()
            
        result = collection.insert_one(data)
        return result.inserted_id
    
    @classmethod
    def find_one(cls, query):
        collection = cls.get_collection()
        return collection.find_one(query)
    
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
    def update_one(cls, query, update_data):
        collection = cls.get_collection()
        return collection.update_one(query, {'$set': update_data})
    
    @classmethod
    def update_by_id(cls, id, update_data):
        collection = cls.get_collection()
        return collection.update_one({'_id': ObjectId(id)}, {'$set': update_data})
    
    @classmethod
    def delete_by_id(cls, id):
        collection = cls.get_collection()
        return collection.delete_one({'_id': ObjectId(id)})