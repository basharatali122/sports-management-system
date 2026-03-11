# from flask import request
# from app.models.sports_category import SportsCategory
# from app.response_handler import response_handler
# from bson import ObjectId

# def create_category():
#     try:
#         data = request.get_json()
#         name = data.get('name')
        
#         if not name:
#             return response_handler(error="Name is required", status_code=400)
        
#         # Check if exists
#         existing = SportsCategory.find_one({'name': name})
#         if existing:
#             return response_handler(error="Category already exists", status_code=400)
        
#         category_data = {'name': name}
#         category_id = SportsCategory.create(category_data)
        
#         return response_handler(
#             data={'category': {'_id': str(category_id), 'name': name}},
#             status_code=201,
#             message="Category created"
#         )
        
#     except Exception as e:
#         return response_handler(error=f"Server Error: {str(e)}", status_code=500)

# # def assign_organizer(category_id):
# #     try:
# #         data = request.get_json()
# #         organizer_id = data.get('organizerId')
        
# #         if not organizer_id:
# #             return response_handler(error="organizerId is required", status_code=400)
        
# #         result = SportsCategory.update_by_id(category_id, {
# #             'organizer': ObjectId(organizer_id)
# #         })
        
# #         if result.modified_count == 0:
# #             return response_handler(error="Category not found", status_code=404)
        
# #         updated = SportsCategory.find_by_id(category_id)
# #         updated['_id'] = str(updated['_id'])
        
# #         return response_handler(
# #             data={'category': updated},
# #             message="Organizer assigned"
# #         )
        
# #     except Exception as e:
# #         return response_handler(error=f"Server Error: {str(e)}", status_code=500)


# def assign_organizer(category_id):
#     try:
#         data = request.get_json()
#         organizer_id = data.get('organizerId')

#         if not organizer_id:
#             return response_handler(error="organizerId is required", status_code=400)

#         result = SportsCategory.update_by_id(category_id, {
#             'organizer': ObjectId(organizer_id)
#         })

#         if result.modified_count == 0:
#             return response_handler(error="Category not found", status_code=404)

#         updated = SportsCategory.find_by_id(category_id)

#         # Convert ObjectIds
#         updated['_id'] = str(updated['_id'])

#         if updated.get('organizer'):
#             updated['organizer'] = str(updated['organizer'])

#         return response_handler(
#             data={'category': updated},
#             message="Organizer assigned"
#         )

#     except Exception as e:
#         return response_handler(error=f"Server Error: {str(e)}", status_code=500)


# def get_categories():
#     try:
#         categories = SportsCategory.find()
#         formatted = []
#         for cat in categories:
#             cat['_id'] = str(cat['_id'])
#             formatted.append(cat)
#         return response_handler(data={'categories': formatted})
#     except Exception as e:
#         return response_handler(error=f"Server Error: {str(e)}", status_code=500)

# def delete_category(category_id):
#     try:
#         result = SportsCategory.delete_by_id(category_id)
#         if result.deleted_count == 0:
#             return response_handler(error="Category not found", status_code=404)
#         return response_handler(message="Category deleted")
#     except Exception as e:
#         return response_handler(error=f"Server Error: {str(e)}", status_code=500)



from flask import request
from bson import ObjectId
from app.models.sports_category import SportsCategory
from app.response_handler import response_handler

from app.models.user import User

# ---------------- CREATE CATEGORY ----------------
def create_category():
    try:
        data = request.get_json()
        name = data.get("name")

        if not name:
            return response_handler(error="Name is required", status_code=400)

        existing = SportsCategory.find_one({"name": name})
        if existing:
            return response_handler(error="Category already exists", status_code=400)

        category_id = SportsCategory.create({
            "name": name
        })

        return response_handler(
            data={
                "category": {
                    "_id": str(category_id),
                    "name": name,
                    "organizer": None
                }
            },
            message="Category created",
            status_code=201
        )

    except Exception as e:
        return response_handler(error=f"Server Error: {str(e)}", status_code=500)


# ---------------- ASSIGN ORGANIZER ----------------
def assign_organizer(category_id):
    try:
        data = request.get_json()
        organizer_id = data.get("organizerId")

        if not organizer_id:
            return response_handler(error="organizerId is required", status_code=400)

        result = SportsCategory.update_by_id(
            category_id,
            {"organizer": ObjectId(organizer_id)}
        )

        if result.modified_count == 0:
            return response_handler(error="Category not found", status_code=404)

        updated = SportsCategory.find_by_id(category_id)

        # Serialize ObjectIds
        updated["_id"] = str(updated["_id"])

        if updated.get("organizer"):
            updated["organizer"] = str(updated["organizer"])

        return response_handler(
            data={"category": updated},
            message="Organizer assigned"
        )

    except Exception as e:
        return response_handler(error=f"Server Error: {str(e)}", status_code=500)


# ---------------- GET ALL CATEGORIES ----------------
# def get_categories():
#     try:
#         categories = SportsCategory.find()

#         formatted = []

#         for cat in categories:

#             formatted_cat = {
#                 "_id": str(cat["_id"]),
#                 "name": cat.get("name"),
#                 "organizer": None
#             }

#             if cat.get("organizer"):
#                 formatted_cat["organizer"] = str(cat["organizer"])

#             formatted.append(formatted_cat)

#         return response_handler(
#             data={"categories": formatted},
#             message="Categories fetched successfully"
#         )

#     except Exception as e:
#         return response_handler(error=f"Server Error: {str(e)}", status_code=500)



def get_categories():
    try:
        categories = SportsCategory.find()

        formatted = []

        for cat in categories:

            organizer_data = None

            if cat.get("organizer"):
                user = User.find_by_id(cat["organizer"])

                if user:
                    organizer_data = {
                        "_id": str(user["_id"]),
                        "name": user.get("name")
                    }

            formatted.append({
                "_id": str(cat["_id"]),
                "name": cat.get("name"),
                "organizer": organizer_data
            })

        return response_handler(
            data={"categories": formatted},
            message="Categories fetched successfully"
        )

    except Exception as e:
        return response_handler(error=f"Server Error: {str(e)}", status_code=500)

# ---------------- DELETE CATEGORY ----------------
def delete_category(category_id):
    try:
        result = SportsCategory.delete_by_id(category_id)

        if result.deleted_count == 0:
            return response_handler(error="Category not found", status_code=404)

        return response_handler(
            message="Category deleted successfully"
        )

    except Exception as e:
        return response_handler(error=f"Server Error: {str(e)}", status_code=500)