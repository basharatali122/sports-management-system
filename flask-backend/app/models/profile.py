from datetime import datetime
from app.config.database import get_db
from bson import ObjectId


class Profile:

    collection = None

    @classmethod
    def get_collection(cls):
        if cls.collection is None:
            db = get_db()
            cls.collection = db.profiles
        return cls.collection

    @classmethod
    def create(cls, profile_data):
        collection = cls.get_collection()
        profile_data["created_at"] = datetime.utcnow()
        result = collection.insert_one(profile_data)
        return result.inserted_id

    @classmethod
    def find_by_user(cls, user_id):
        collection = cls.get_collection()
        return collection.find_one({"userId": ObjectId(user_id)})

    @classmethod
    def update_by_user(cls, user_id, data):
        collection = cls.get_collection()
        return collection.update_one(
            {"userId": ObjectId(user_id)},
            {"$set": data}
        )

    @classmethod
    def find_all(cls):
        collection = cls.get_collection()
        return list(collection.find())

    @classmethod
    def find_by_id(cls, profile_id):
        collection = cls.get_collection()
        return collection.find_one({"_id": ObjectId(profile_id)})

    @classmethod
    def delete_by_id(cls, profile_id):
        collection = cls.get_collection()
        return collection.delete_one({"_id": ObjectId(profile_id)})