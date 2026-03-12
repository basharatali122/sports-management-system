from flask import request
from bson import ObjectId
from flask_jwt_extended import get_jwt_identity, get_jwt
from app.models.profile import Profile
from app.response_handler import response_handler
from app.models.user import User

def convert_objectid(data):
    if not data:
        return data

    if "_id" in data:
        data["_id"] = str(data["_id"])

    if "userId" in data:
        data["userId"] = str(data["userId"])

    return data


# =========================
# GET MY PROFILE
# =========================
# def get_my_profile():
#     try:
#         user_id = get_jwt_identity()

#         print("User ID from JWT:", user_id)

#         profile = Profile.find_by_user(user_id)

#         if not profile:
#             return response_handler(
#                 message="Profile not found",
#                 data={}
#             )

#         profile = convert_objectid(profile)

#         return response_handler(data=profile)

#     except Exception as e:
#         return response_handler(error=str(e), status_code=500)




def get_my_profile():
    try:
        user_id = get_jwt_identity()

        print("User ID from JWT:", user_id)

        profile = Profile.find_by_user(user_id)

        if not profile:
            return response_handler(
                message="Profile not found",
                data={}
            )

        profile = convert_objectid(profile)

        return response_handler(data=profile)

    except Exception as e:
        return response_handler(error=str(e), status_code=500)



# =========================
# CREATE / UPDATE PROFILE
# =========================
def update_profile():
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        role = claims.get("role")

        data = request.get_json()

        profile_data = {
            "bio": data.get("bio"),
            "location": data.get("location"),
            "phone": data.get("phone")
        }

        # PARTICIPANT FIELDS
        if role == "participant":
            profile_data.update({
                "sportsPreferences": data.get("sportsPreferences", []),
                "pastParticipation": data.get("pastParticipation", []),
                "achievements": data.get("achievements", [])
            })

        # COACH FIELDS
        if role == "coach":
            profile_data.update({
                "sportsExpertise": data.get("sportsExpertise", []),
                "teamsManaged": data.get("teamsManaged", []),
                "availability": data.get("availability")
            })

        existing = Profile.find_by_user(user_id)

        if existing:
            Profile.update_by_user(user_id, profile_data)
        else:
            profile_data["userId"] = ObjectId(user_id)
            Profile.create(profile_data)

        profile = Profile.find_by_user(user_id)
        profile = convert_objectid(profile)

        return response_handler(
            data=profile,
            message="Profile updated successfully"
        )

    except Exception as e:
        return response_handler(error=str(e), status_code=500)


# =========================
# ADMIN VIEW ALL PROFILES
# =========================
# def get_all_profiles():
#     try:
#         profiles = Profile.find_all()

#         result = []
#         for p in profiles:
#             result.append(convert_objectid(p))

#         return response_handler(data=result)

#     except Exception as e:
#         return response_handler(error=str(e), status_code=500)




def get_all_profiles():
    try:
        profiles = Profile.find_all()

        result = []

        for p in profiles:

            user = User.find_by_id(str(p["userId"]))

            profile_data = convert_objectid(p)

            if user:
                profile_data["name"] = user.get("name")
                profile_data["role"] = user.get("role")
                profile_data["sport"] = user.get("sport")
                profile_data["sportsPreferences"] = user.get("sportsPreferences")

            result.append(profile_data)

        return response_handler(data=result)

    except Exception as e:
        return response_handler(error=str(e), status_code=500)

# =========================
# ADMIN UPDATE USER PROFILE
# =========================

def admin_update_profile(profile_id):
    try:

        data = request.get_json()

        profile = Profile.find_by_id(profile_id)

        if not profile:
            return response_handler(
                error="Profile not found",
                status_code=404
            )

        user_id = profile["userId"]

        # -----------------------
        # UPDATE PROFILE FIELDS
        # -----------------------

        profile_fields = [
            "bio",
            "location",
            "phone",
            "sportsPreferences",
            "pastParticipation",
            "achievements",
            "sportsExpertise",
            "teamsManaged",
            "availability"
        ]

        profile_update = {}

        for field in profile_fields:
            if field in data:
                profile_update[field] = data[field]

        if profile_update:
            Profile.collection.update_one(
                {"_id": ObjectId(profile_id)},
                {"$set": profile_update}
            )

        # -----------------------
        # UPDATE USER FIELDS
        # -----------------------

        user_fields = [
            "name",
            "role",
            "sport"
        ]

        user_update = {}

        for field in user_fields:
            if field in data:
                user_update[field] = data[field]

        if user_update:
            User.update_by_id(user_id, user_update)

        updated_profile = Profile.find_by_id(profile_id)

        return response_handler(
            data=convert_objectid(updated_profile),
            message="Profile updated by admin"
        )

    except Exception as e:
        return response_handler(error=str(e), status_code=500)
    
    
# def admin_update_profile(profile_id):
    try:
        data = request.get_json()

        Profile.collection.update_one(
            {"_id": ObjectId(profile_id)},
            {"$set": data}
        )

        profile = Profile.find_by_id(profile_id)

        return response_handler(
            data=convert_objectid(profile),
            message="Profile updated by admin"
        )

    except Exception as e:
        return response_handler(error=str(e), status_code=500)