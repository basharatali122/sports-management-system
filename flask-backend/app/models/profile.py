from app.config.db import db
from bson import ObjectId
from datetime import datetime

class Profile:
    collection = db["profiles"]

    @staticmethod
    def create(profile_data):
        profile_data["created_at"] = datetime.utcnow()
        result = Profile.collection.insert_one(profile_data)
        return result.inserted_id

    @staticmethod
    def find_by_user(user_id):
        return Profile.collection.find_one({"userId": ObjectId(user_id)})

    @staticmethod
    def update_by_user(user_id, data):
        return Profile.collection.update_one(
            {"userId": ObjectId(user_id)},
            {"$set": data}
        )

    @staticmethod
    def find_all():
        return list(Profile.collection.find())

    @staticmethod
    def find_by_id(profile_id):
        return Profile.collection.find_one({"_id": ObjectId(profile_id)})

    @staticmethod
    def delete_by_id(profile_id):
        return Profile.collection.delete_one({"_id": ObjectId(profile_id)})