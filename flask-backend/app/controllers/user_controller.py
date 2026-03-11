# # from flask import request
# # from app.models.user import User
# # from app.response_handler import response_handler
# # import bcrypt
# # from bson import ObjectId
# # from datetime import datetime

# # def get_all_users():
# #     try:
# #         # Get query parameters
# #         role = request.args.get('role')
# #         approval_status = request.args.get('approvalStatus')
        
# #         filter_query = {}
        
# #         if role:
# #             filter_query['role'] = role
        
# #         if approval_status:
# #             if approval_status == 'approved':
# #                 filter_query['approved'] = True
# #             elif approval_status == 'pending':
# #                 filter_query['$or'] = [
# #                     {'approved': False},
# #                     {'approvedByCoach': False}
# #                 ]
# #             elif approval_status == 'rejected':
# #                 filter_query['status'] = 'rejected'
        
# #         users = User.find(filter_query)
        
# #         # Format users for response (remove password)
# #         formatted_users = []
# #         for user in users:
# #             user['_id'] = str(user['_id'])
# #             if 'password' in user:
# #                 del user['password']
# #             formatted_users.append(user)
        
# #         return response_handler(data=formatted_users, message="Users fetched successfully")
    
# #     except Exception as e:
# #         print(f"Error fetching users: {e}")
# #         return response_handler(error="Server error while fetching users", status_code=500)

# # def create_user():
# #     try:
# #         data = request.get_json()
# #         name = data.get('name')
# #         email = data.get('email', '').strip().lower()
# #         password = data.get('password')
# #         role = data.get('role', 'participant')
# #         sport = data.get('sport')
        
# #         # Basic validation
# #         if not name or not email or not password:
# #             return response_handler(
# #                 error="Name, email, and password are required",
# #                 status_code=400
# #             )
        
# #         # Check if user exists
# #         existing_user = User.find_one({'email': email})
# #         if existing_user:
# #             return response_handler(
# #                 error="User with this email already exists",
# #                 status_code=409
# #             )
        
# #         # Prevent multiple admins
# #         if role == 'admin':
# #             admin_exists = User.find_one({'role': 'admin'})
# #             if admin_exists:
# #                 return response_handler(
# #                     error="An admin account already exists",
# #                     status_code=400
# #                 )
        
# #         # Coach-specific validation
# #         valid_sports = ['Cricket', 'Football', 'Tennis', 'Hockey']
# #         if role == 'coach':
# #             if not sport or sport not in valid_sports:
# #                 return response_handler(
# #                     error="Coaches must select a valid sport (Cricket, Football, Tennis, Hockey)",
# #                     status_code=400
# #                 )
        
# #         # Create user
# #         user_data = {
# #             'name': name,
# #             'email': email,
# #             'password': password,  # Will be hashed in model
# #             'role': role,
# #             'accountStatus': 'active',
# #             'approvalStatus': 'pending-coach',
# #             'created_at': datetime.utcnow()
# #         }
        
# #         if role == 'coach':
# #             user_data['sport'] = sport
        
# #         user_id = User.create(user_data)
        
# #         # Get created user
# #         new_user = User.find_by_id(user_id)
# #         if new_user and 'password' in new_user:
# #             del new_user['password']
# #         new_user['_id'] = str(new_user['_id'])
        
# #         return response_handler(
# #             data=new_user,
# #             status_code=201,
# #             message="User created successfully"
# #         )
        
# #     except Exception as e:
# #         print(f"Error creating user: {e}")
# #         return response_handler(error="Internal server error", status_code=500)

# # def get_profile():
# #     try:
# #         auth_header = request.headers.get('Authorization')
# #         if not auth_header or not auth_header.startswith('Bearer '):
# #             return response_handler(error="Unauthorized", status_code=401)
        
# #         # User should be set by auth middleware
# #         if hasattr(request, 'user'):
# #             user = request.user
# #             return response_handler(data={'user': user})
        
# #         return response_handler(error="User not found", status_code=404)
        
# #     except Exception as e:
# #         print(f"Error in get_profile: {e}")
# #         return response_handler(error="Server error", status_code=500)

# # def update_profile():
# #     try:
# #         if not hasattr(request, 'user'):
# #             return response_handler(error="Unauthorized", status_code=401)
        
# #         data = request.get_json()
# #         user_id = request.user['_id']
        
# #         update_data = {}
# #         if 'name' in data:
# #             update_data['name'] = data['name']
# #         if 'email' in data:
# #             update_data['email'] = data['email']
# #         if 'sportsPreferences' in data:
# #             update_data['sportsPreferences'] = data['sportsPreferences']
# #         if 'achievements' in data:
# #             update_data['achievements'] = data['achievements']
        
# #         User.update_by_id(user_id, update_data)
        
# #         # Get updated user
# #         updated_user = User.find_by_id(user_id)
# #         if updated_user and 'password' in updated_user:
# #             del updated_user['password']
# #         updated_user['_id'] = str(updated_user['_id'])
        
# #         return response_handler(
# #             data=updated_user,
# #             message="Profile updated successfully"
# #         )
        
# #     except Exception as e:
# #         print(f"Error in update_profile: {e}")
# #         return response_handler(error="Server error", status_code=500)

# # def get_user_by_id(user_id):
# #     try:
# #         user = User.find_by_id(user_id)
# #         if not user:
# #             return response_handler(error="User not found", status_code=404)
        
# #         if 'password' in user:
# #             del user['password']
# #         user['_id'] = str(user['_id'])
        
# #         return response_handler(data=user)
        
# #     except Exception as e:
# #         return response_handler(error="Server error", status_code=500)

# # def update_user(user_id):
# #     try:
# #         data = request.get_json()
# #         update_data = {}
        
# #         fields = ['name', 'email', 'sportsPreferences', 'achievements']
# #         for field in fields:
# #             if field in data:
# #                 update_data[field] = data[field]
        
# #         result = User.update_by_id(user_id, update_data)
        
# #         if result.modified_count == 0:
# #             return response_handler(error="User not found or no changes", status_code=404)
        
# #         updated_user = User.find_by_id(user_id)
# #         if updated_user and 'password' in updated_user:
# #             del updated_user['password']
# #         updated_user['_id'] = str(updated_user['_id'])
        
# #         return response_handler(data=updated_user, message="User updated successfully")
        
# #     except Exception as e:
# #         return response_handler(error="Update failed", status_code=500)

# # def get_all_coaches():
# #     try:
# #         coaches = User.find({'role': 'coach'})
# #         formatted_coaches = []
# #         for coach in coaches:
# #             coach['_id'] = str(coach['_id'])
# #             if 'password' in coach:
# #                 del coach['password']
# #             formatted_coaches.append(coach)
# #         return response_handler(data=formatted_coaches)
# #     except Exception as e:
# #         return response_handler(error="Internal Server Error", status_code=500)

# # def get_all_participants():
# #     try:
# #         participants = User.find({'role': 'participant'})
# #         formatted_participants = []
# #         for p in participants:
# #             p['_id'] = str(p['_id'])
# #             if 'password' in p:
# #                 del p['password']
# #             formatted_participants.append(p)
# #         return response_handler(data=formatted_participants)
# #     except Exception as e:
# #         return response_handler(error="Internal Server Error", status_code=500)

# # def get_organizers():
# #     try:
# #         organizers = User.find({'role': 'coach'})
# #         if not organizers:
# #             return response_handler(
# #                 error="No organizers (coaches) found",
# #                 status_code=404
# #             )
        
# #         formatted_organizers = []
# #         for org in organizers:
# #             org['_id'] = str(org['_id'])
# #             if 'password' in org:
# #                 del org['password']
# #             formatted_organizers.append(org)
        
# #         return response_handler(data=formatted_organizers)
# #     except Exception as e:
# #         return response_handler(error="Server error", status_code=500)

# # def approve_user(user_id):
# #     try:
# #         result = User.update_by_id(user_id, {
# #             'status': 'approved',
# #             'approved': True
# #         })
        
# #         if result.modified_count == 0:
# #             return response_handler(error="User not found", status_code=404)
        
# #         updated_user = User.find_by_id(user_id)
# #         if updated_user and 'password' in updated_user:
# #             del updated_user['password']
# #         updated_user['_id'] = str(updated_user['_id'])
        
# #         return response_handler(
# #             data=updated_user,
# #             message="User approved successfully"
# #         )
        
# #     except Exception as e:
# #         return response_handler(error="Internal server error", status_code=500)

# # def reject_user(user_id):
# #     try:
# #         result = User.update_by_id(user_id, {'status': 'rejected'})
        
# #         if result.modified_count == 0:
# #             return response_handler(error="User not found", status_code=404)
        
# #         updated_user = User.find_by_id(user_id)
# #         if updated_user and 'password' in updated_user:
# #             del updated_user['password']
# #         updated_user['_id'] = str(updated_user['_id'])
        
# #         return response_handler(
# #             data=updated_user,
# #             message="User rejected successfully"
# #         )
        
# #     except Exception as e:
# #         return response_handler(error="Internal server error", status_code=500)

# # def admin_check():
# #     try:
# #         admin = User.find_one({'role': 'admin'})
# #         return response_handler(data={'adminExists': admin is not None})
# #     except Exception as e:
# #         return response_handler(error="Error checking admin", status_code=500)



# from flask import request
# from app.models.user import User
# from app.response_handler import response_handler
# import bcrypt
# from bson import ObjectId
# from datetime import datetime

# def get_all_users():
#     try:
#         # Get query parameters
#         role = request.args.get('role')
#         approval_status = request.args.get('approvalStatus')
        
#         filter_query = {}
        
#         if role:
#             filter_query['role'] = role
        
#         if approval_status:
#             if approval_status == 'approved':
#                 filter_query['approved'] = True
#             elif approval_status == 'pending':
#                 filter_query['$or'] = [
#                     {'approved': False},
#                     {'approvedByCoach': False}
#                 ]
#             elif approval_status == 'rejected':
#                 filter_query['status'] = 'rejected'
        
#         users = User.find(filter_query)
        
#         # Format users for response (remove password)
#         formatted_users = []
#         for user in users:
#             user['_id'] = str(user['_id'])
#             if 'password' in user:
#                 del user['password']
#             formatted_users.append(user)
        
#         return response_handler(data=formatted_users, message="Users fetched successfully")
    
#     except Exception as e:
#         print(f"Error fetching users: {e}")
#         return response_handler(error="Server error while fetching users", status_code=500)

# def create_user():
#     try:
#         data = request.get_json()
#         name = data.get('name')
#         email = data.get('email', '').strip().lower()
#         password = data.get('password')
#         role = data.get('role', 'participant')
#         sport = data.get('sport')
        
#         # Basic validation
#         if not name or not email or not password:
#             return response_handler(
#                 error="Name, email, and password are required",
#                 status_code=400
#             )
        
#         # Check if user exists
#         existing_user = User.find_one({'email': email})
#         if existing_user:
#             return response_handler(
#                 error="User with this email already exists",
#                 status_code=409
#             )
        
#         # Prevent multiple admins
#         if role == 'admin':
#             admin_exists = User.find_one({'role': 'admin'})
#             if admin_exists:
#                 return response_handler(
#                     error="An admin account already exists",
#                     status_code=400
#                 )
        
#         # Coach-specific validation
#         valid_sports = ['Cricket', 'Football', 'Tennis', 'Hockey']
#         if role == 'coach':
#             if not sport or sport not in valid_sports:
#                 return response_handler(
#                     error="Coaches must select a valid sport (Cricket, Football, Tennis, Hockey)",
#                     status_code=400
#                 )
        
#         # Hash the password
#         hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
#         # Create user
#         user_data = {
#             'name': name,
#             'email': email,
#             'password': hashed_password,  # Now hashed!
#             'role': role,
#             'accountStatus': 'active',
#             'approvalStatus': 'pending-coach',
#             'created_at': datetime.utcnow()
#         }
        
#         if role == 'coach':
#             user_data['sport'] = sport
        
#         user_id = User.create(user_data)
        
#         # Get created user
#         new_user = User.find_by_id(user_id)
#         if new_user and 'password' in new_user:
#             del new_user['password']
#         new_user['_id'] = str(new_user['_id'])
        
#         return response_handler(
#             data=new_user,
#             status_code=201,
#             message="User created successfully"
#         )
        
#     except Exception as e:
#         print(f"Error creating user: {e}")
#         return response_handler(error="Internal server error", status_code=500)

# # def get_profile():
#     try:
#         auth_header = request.headers.get('Authorization')
#         if not auth_header or not auth_header.startswith('Bearer '):
#             return response_handler(error="Unauthorized", status_code=401)
        
#         # User should be set by auth middleware
#         if hasattr(request, 'user'):
#             user = request.user
#             return response_handler(data={'user': user})
        
#         return response_handler(error="User not found", status_code=404)
        
#     except Exception as e:
#         print(f"Error in get_profile: {e}")
#         return response_handler(error="Server error", status_code=500)


# def get_profile():
#     """Get current user profile using JWT"""
#     try:
#         # Get user ID from JWT token
#         current_user_id = get_jwt_identity()
        
#         if not current_user_id:
#             return response_handler(error="Invalid token", status_code=401)
        
#         # Validate ObjectId
#         if not ObjectId.is_valid(current_user_id):
#             return response_handler(error="Invalid user ID format", status_code=400)
        
#         # Fetch user
#         user = User.find_by_id(current_user_id)
#         if not user:
#             return response_handler(error="User not found", status_code=404)
        
#         # Format response
#         if 'password' in user:
#             del user['password']
#         user['_id'] = str(user['_id'])
        
#         return response_handler(data={'user': user})
        
#     except Exception as e:
#         print(f"Error in get_profile: {e}")
#         return response_handler(error="Server error", status_code=500)

# def update_profile():
#     try:
#         if not hasattr(request, 'user'):
#             return response_handler(error="Unauthorized", status_code=401)
        
#         data = request.get_json()
#         user_id = request.user['_id']
        
#         update_data = {}
#         if 'name' in data:
#             update_data['name'] = data['name']
#         if 'email' in data:
#             update_data['email'] = data['email']
#         if 'sportsPreferences' in data:
#             update_data['sportsPreferences'] = data['sportsPreferences']
#         if 'achievements' in data:
#             update_data['achievements'] = data['achievements']
        
#         # Don't allow password update through this endpoint
#         if 'password' in data:
#             return response_handler(error="Cannot update password through profile endpoint", status_code=400)
        
#         User.update_by_id(user_id, update_data)
        
#         # Get updated user
#         updated_user = User.find_by_id(user_id)
#         if updated_user and 'password' in updated_user:
#             del updated_user['password']
#         updated_user['_id'] = str(updated_user['_id'])
        
#         return response_handler(
#             data=updated_user,
#             message="Profile updated successfully"
#         )
        
#     except Exception as e:
#         print(f"Error in update_profile: {e}")
#         return response_handler(error="Server error", status_code=500)

# def get_user_by_id(user_id):
#     try:
#         # Validate ObjectId
#         if not ObjectId.is_valid(user_id):
#             return response_handler(error="Invalid user ID format", status_code=400)
            
#         user = User.find_by_id(user_id)
#         if not user:
#             return response_handler(error="User not found", status_code=404)
        
#         if 'password' in user:
#             del user['password']
#         user['_id'] = str(user['_id'])
        
#         return response_handler(data=user)
        
#     except Exception as e:
#         print(f"Error in get_user_by_id: {e}")
#         return response_handler(error="Server error", status_code=500)

# def update_user(user_id):
#     try:
#         # Validate ObjectId
#         if not ObjectId.is_valid(user_id):
#             return response_handler(error="Invalid user ID format", status_code=400)
            
#         data = request.get_json()
#         update_data = {}
        
#         fields = ['name', 'email', 'sportsPreferences', 'achievements', 'role', 'sport']
#         for field in fields:
#             if field in data:
#                 update_data[field] = data[field]
        
#         # Handle password separately if provided
#         if 'password' in data:
#             update_data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
#         result = User.update_by_id(user_id, update_data)
        
#         if result.modified_count == 0 and result.matched_count == 0:
#             return response_handler(error="User not found", status_code=404)
        
#         updated_user = User.find_by_id(user_id)
#         if updated_user and 'password' in updated_user:
#             del updated_user['password']
#         updated_user['_id'] = str(updated_user['_id'])
        
#         return response_handler(data=updated_user, message="User updated successfully")
        
#     except Exception as e:
#         print(f"Error in update_user: {e}")
#         return response_handler(error="Update failed", status_code=500)

# def get_all_coaches():
#     try:
#         coaches = User.find({'role': 'coach'})
#         formatted_coaches = []
#         for coach in coaches:
#             coach['_id'] = str(coach['_id'])
#             if 'password' in coach:
#                 del coach['password']
#             formatted_coaches.append(coach)
#         return response_handler(data=formatted_coaches)
#     except Exception as e:
#         print(f"Error in get_all_coaches: {e}")
#         return response_handler(error="Internal Server Error", status_code=500)

# def get_all_participants():
#     try:
#         participants = User.find({'role': 'participant'})
#         formatted_participants = []
#         for p in participants:
#             p['_id'] = str(p['_id'])
#             if 'password' in p:
#                 del p['password']
#             formatted_participants.append(p)
#         return response_handler(data=formatted_participants)
#     except Exception as e:
#         print(f"Error in get_all_participants: {e}")
#         return response_handler(error="Internal Server Error", status_code=500)

# def get_organizers():
#     try:
#         organizers = User.find({'role': 'coach'})
        
#         formatted_organizers = []
#         for org in organizers:
#             org['_id'] = str(org['_id'])
#             if 'password' in org:
#                 del org['password']
#             formatted_organizers.append(org)
        
#         if not formatted_organizers:
#             return response_handler(
#                 data=[],
#                 message="No organizers (coaches) found"
#             )
        
#         return response_handler(data=formatted_organizers)
#     except Exception as e:
#         print(f"Error in get_organizers: {e}")
#         return response_handler(error="Server error", status_code=500)

# def approve_user(user_id):
#     try:
#         # Validate ObjectId
#         if not ObjectId.is_valid(user_id):
#             return response_handler(error="Invalid user ID format", status_code=400)
            
#         result = User.update_by_id(user_id, {
#             'status': 'approved',
#             'approved': True,
#             'approvalStatus': 'approved'
#         })
        
#         if result.matched_count == 0:
#             return response_handler(error="User not found", status_code=404)
        
#         updated_user = User.find_by_id(user_id)
#         if updated_user and 'password' in updated_user:
#             del updated_user['password']
#         updated_user['_id'] = str(updated_user['_id'])
        
#         return response_handler(
#             data=updated_user,
#             message="User approved successfully"
#         )
        
#     except Exception as e:
#         print(f"Error in approve_user: {e}")
#         return response_handler(error="Internal server error", status_code=500)

# def reject_user(user_id):
#     try:
#         # Validate ObjectId
#         if not ObjectId.is_valid(user_id):
#             return response_handler(error="Invalid user ID format", status_code=400)
            
#         result = User.update_by_id(user_id, {
#             'status': 'rejected',
#             'approvalStatus': 'rejected'
#         })
        
#         if result.matched_count == 0:
#             return response_handler(error="User not found", status_code=404)
        
#         updated_user = User.find_by_id(user_id)
#         if updated_user and 'password' in updated_user:
#             del updated_user['password']
#         updated_user['_id'] = str(updated_user['_id'])
        
#         return response_handler(
#             data=updated_user,
#             message="User rejected successfully"
#         )
        
#     except Exception as e:
#         print(f"Error in reject_user: {e}")
#         return response_handler(error="Internal server error", status_code=500)

# def admin_check():
#     try:
#         admin = User.find_one({'role': 'admin'})
#         return response_handler(data={'adminExists': admin is not None})
#     except Exception as e:
#         print(f"Error in admin_check: {e}")
#         return response_handler(error="Error checking admin", status_code=500)




from flask import request
from flask_jwt_extended import get_jwt_identity
from app.models.user import User
from app.response_handler import response_handler
import bcrypt
from bson import ObjectId
from datetime import datetime

def get_all_users():
    try:
        # Get query parameters
        role = request.args.get('role')
        approval_status = request.args.get('approvalStatus')
        
        filter_query = {}
        
        if role:
            filter_query['role'] = role
        
        if approval_status:
            if approval_status == 'approved':
                filter_query['approved'] = True
            elif approval_status == 'pending':
                filter_query['$or'] = [
                    {'approved': False},
                    {'approvedByCoach': False}
                ]
            elif approval_status == 'rejected':
                filter_query['status'] = 'rejected'
        
        users = User.find(filter_query)
        
        # Format users for response (remove password)
        formatted_users = []
        for user in users:
            user['_id'] = str(user['_id'])
            if 'password' in user:
                del user['password']
            formatted_users.append(user)
        
        return response_handler(data=formatted_users, message="Users fetched successfully")
    
    except Exception as e:
        print(f"Error fetching users: {e}")
        return response_handler(error="Server error while fetching users", status_code=500)

# def create_user():
#     try:
#         data = request.get_json()
#         name = data.get('name')
#         email = data.get('email', '').strip().lower()
#         password = data.get('password')
#         role = data.get('role', 'participant')
#         sport = data.get('sport')
        
#         # Basic validation
#         if not name or not email or not password:
#             return response_handler(
#                 error="Name, email, and password are required",
#                 status_code=400
#             )
        
#         # Check if user exists
#         existing_user = User.find_one({'email': email})
#         if existing_user:
#             return response_handler(
#                 error="User with this email already exists",
#                 status_code=409
#             )
        
#         # Prevent multiple admins
#         if role == 'admin':
#             admin_exists = User.find_one({'role': 'admin'})
#             if admin_exists:
#                 return response_handler(
#                     error="An admin account already exists",
#                     status_code=400
#                 )
        
#         # Coach-specific validation
#         valid_sports = ['Cricket', 'Football', 'Tennis', 'Hockey']
#         if role == 'coach':
#             if not sport or sport not in valid_sports:
#                 return response_handler(
#                     error="Coaches must select a valid sport (Cricket, Football, Tennis, Hockey)",
#                     status_code=400
#                 )
        
#         # 🔥 FIXED: Handle password hashing properly
#         # Check if password is already bytes, if not, encode it
#         if isinstance(password, bytes):
#             password_bytes = password
#         else:
#             password_bytes = password.encode('utf-8')
        
#         # Hash the password
#         hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        
#         # Create user
#         user_data = {
#             'name': name,
#             'email': email,
#             'password': hashed_password,  # Store as bytes (MongoDB can handle this)
#             'role': role,
#             'accountStatus': 'active',
#             'created_at': datetime.utcnow()
#         }
        
#         # Set approval status based on role
#         if role == 'coach':
#             user_data['sport'] = sport
#             user_data['approved'] = False
#             user_data['approvalStatus'] = 'pending-coach'
#         else:
#             user_data['approved'] = True
#             user_data['approvalStatus'] = 'approved'
        
#         user_id = User.create(user_data)
        
#         # Get created user
#         new_user = User.find_by_id(user_id)
#         if new_user and 'password' in new_user:
#             del new_user['password']
#         new_user['_id'] = str(new_user['_id'])
        
#         return response_handler(
#             data=new_user,
#             status_code=201,
#             message="User created successfully"
#         )
        
#     except Exception as e:
#         print(f"Error creating user: {e}")
#         import traceback
#         traceback.print_exc()
#         return response_handler(error="Internal server error", status_code=500)


def create_user():
    try:
        data = request.get_json()

        name = data.get('name')
        email = data.get('email', '').strip().lower()
        password = data.get('password')
        role = data.get('role', 'participant')

        sport = data.get('sport')
        sports_preferences = data.get('sportsPreferences', [])

        valid_sports = ['Cricket', 'Football', 'Tennis', 'Hockey']

        # Basic validation
        if not name or not email or not password:
            return response_handler(
                error="Name, email, and password are required",
                status_code=400
            )

        # Check if user already exists
        existing_user = User.find_one({'email': email})
        if existing_user:
            return response_handler(
                error="User with this email already exists",
                status_code=409
            )

        # Prevent multiple admins
        if role == 'admin':
            admin_exists = User.find_one({'role': 'admin'})
            if admin_exists:
                return response_handler(
                    error="An admin account already exists",
                    status_code=400
                )

        # -------- COACH VALIDATION --------
        if role == 'coach':
            if not sport or sport not in valid_sports:
                return response_handler(
                    error="Coaches must select a valid sport (Cricket, Football, Tennis, Hockey)",
                    status_code=400
                )

        # -------- PARTICIPANT VALIDATION --------
        if role == 'participant':

            if not isinstance(sports_preferences, list):
                return response_handler(
                    error="sportsPreferences must be an array",
                    status_code=400
                )

            if len(sports_preferences) == 0:
                return response_handler(
                    error="Participants must select at least one sport",
                    status_code=400
                )

            if len(sports_preferences) > 2:
                return response_handler(
                    error="Participants can select maximum 2 sports",
                    status_code=400
                )

            for s in sports_preferences:
                if s not in valid_sports:
                    return response_handler(
                        error=f"Invalid sport selected: {s}",
                        status_code=400
                    )

        # Password hashing
        password_bytes = password.encode('utf-8')
        hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

        # Base user data
        user_data = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'role': role,
            'accountStatus': 'active',
            'created_at': datetime.utcnow()
        }

        # -------- ROLE LOGIC --------

        if role == 'coach':

            user_data['sport'] = sport
            user_data['approved'] = False
            user_data['approvedByCoach'] = True
            user_data['approvalStatus'] = 'pending-admin'
            user_data['status'] = 'pending'

        elif role == 'participant':

            user_data['sportsPreferences'] = sports_preferences
            user_data['approved'] = True
            user_data['approvedByCoach'] = False
            user_data['approvalStatus'] = 'pending-coach'
            user_data['status'] = 'pending'

        else:  # admin

            user_data['approved'] = True
            user_data['approvedByCoach'] = True
            user_data['approvalStatus'] = 'approved'
            user_data['status'] = 'approved'

        # Create user
        user_id = User.create(user_data)

        new_user = User.find_by_id(user_id)

        if 'password' in new_user:
            del new_user['password']

        new_user['_id'] = str(new_user['_id'])

        return response_handler(
            data=new_user,
            status_code=201,
            message="User created successfully"
        )

    except Exception as e:
        print("Error creating user:", e)
        import traceback
        traceback.print_exc()

        return response_handler(
            error="Internal server error",
            status_code=500
        )


def get_profile():
    """Get current user profile using JWT"""
    try:
        # Get user ID from JWT token
        current_user_id = get_jwt_identity()
        
        if not current_user_id:
            return response_handler(error="Invalid token", status_code=401)
        
        # Validate ObjectId
        if not ObjectId.is_valid(current_user_id):
            return response_handler(error="Invalid user ID format", status_code=400)
        
        # Fetch user from database
        user = User.find_by_id(current_user_id)
        if not user:
            return response_handler(error="User not found", status_code=404)
        
        # Remove password before sending
        if 'password' in user:
            del user['password']
        
        # Convert ObjectId to string
        user['_id'] = str(user['_id'])
        
        return response_handler(data={'user': user})
        
    except Exception as e:
        print(f"Error in get_profile: {e}")
        return response_handler(error="Server error", status_code=500)

def update_profile():
    """Update current user profile"""
    try:
        # Get user ID from JWT token
        current_user_id = get_jwt_identity()
        
        if not current_user_id:
            return response_handler(error="Invalid token", status_code=401)
        
        # Validate ObjectId
        if not ObjectId.is_valid(current_user_id):
            return response_handler(error="Invalid user ID format", status_code=400)
        
        data = request.get_json()
        
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'email' in data:
            update_data['email'] = data['email']
        if 'sportsPreferences' in data:
            update_data['sportsPreferences'] = data['sportsPreferences']
        if 'achievements' in data:
            update_data['achievements'] = data['achievements']
        
        # Don't allow password update through this endpoint
        if 'password' in data:
            return response_handler(error="Cannot update password through profile endpoint", status_code=400)
        
        result = User.update_by_id(current_user_id, update_data)
        
        if result.matched_count == 0:
            return response_handler(error="User not found", status_code=404)
        
        # Get updated user
        updated_user = User.find_by_id(current_user_id)
        if updated_user and 'password' in updated_user:
            del updated_user['password']
        updated_user['_id'] = str(updated_user['_id'])
        
        return response_handler(
            data=updated_user,
            message="Profile updated successfully"
        )
        
    except Exception as e:
        print(f"Error in update_profile: {e}")
        return response_handler(error="Server error", status_code=500)

def get_user_by_id(user_id):
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID format", status_code=400)
            
        user = User.find_by_id(user_id)
        if not user:
            return response_handler(error="User not found", status_code=404)
        
        if 'password' in user:
            del user['password']
        user['_id'] = str(user['_id'])
        
        return response_handler(data=user)
        
    except Exception as e:
        print(f"Error in get_user_by_id: {e}")
        return response_handler(error="Server error", status_code=500)

def update_user(user_id):
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID format", status_code=400)
            
        data = request.get_json()
        update_data = {}
        
        fields = ['name', 'email', 'sportsPreferences', 'achievements', 'role', 'sport']
        for field in fields:
            if field in data:
                update_data[field] = data[field]
        
        # Handle password separately if provided
        if 'password' in data:
            password = data['password']
            if isinstance(password, bytes):
                password_bytes = password
            else:
                password_bytes = password.encode('utf-8')
            update_data['password'] = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        
        result = User.update_by_id(user_id, update_data)
        
        if result.modified_count == 0 and result.matched_count == 0:
            return response_handler(error="User not found", status_code=404)
        
        updated_user = User.find_by_id(user_id)
        if updated_user and 'password' in updated_user:
            del updated_user['password']
        updated_user['_id'] = str(updated_user['_id'])
        
        return response_handler(data=updated_user, message="User updated successfully")
        
    except Exception as e:
        print(f"Error in update_user: {e}")
        return response_handler(error="Update failed", status_code=500)

def get_all_coaches():
    try:
        coaches = User.find({'role': 'coach'})
        formatted_coaches = []
        for coach in coaches:
            coach['_id'] = str(coach['_id'])
            if 'password' in coach:
                del coach['password']
            formatted_coaches.append(coach)
        return response_handler(data=formatted_coaches)
    except Exception as e:
        print(f"Error in get_all_coaches: {e}")
        return response_handler(error="Internal Server Error", status_code=500)

def get_all_participants():
    try:
        participants = User.find({'role': 'participant'})
        formatted_participants = []
        for p in participants:
            p['_id'] = str(p['_id'])
            if 'password' in p:
                del p['password']
            formatted_participants.append(p)
        return response_handler(data=formatted_participants)
    except Exception as e:
        print(f"Error in get_all_participants: {e}")
        return response_handler(error="Internal Server Error", status_code=500)

def get_organizers():
    try:
        organizers = User.find({'role': 'coach'})
        
        formatted_organizers = []
        for org in organizers:
            org['_id'] = str(org['_id'])
            if 'password' in org:
                del org['password']
            formatted_organizers.append(org)
        
        if not formatted_organizers:
            return response_handler(
                data=[],
                message="No organizers (coaches) found"
            )
        
        return response_handler(data=formatted_organizers)
    except Exception as e:
        print(f"Error in get_organizers: {e}")
        return response_handler(error="Server error", status_code=500)

# def approve_user(user_id):
#     try:
#         # Validate ObjectId
#         if not ObjectId.is_valid(user_id):
#             return response_handler(error="Invalid user ID format", status_code=400)
            
#         result = User.update_by_id(user_id, {
#             'status': 'approved',
#             'approved': True,
#             'approvalStatus': 'approved'
#         })
        
#         if result.matched_count == 0:
#             return response_handler(error="User not found", status_code=404)
        
#         updated_user = User.find_by_id(user_id)
#         if updated_user and 'password' in updated_user:
#             del updated_user['password']
#         updated_user['_id'] = str(updated_user['_id'])
        
#         return response_handler(
#             data=updated_user,
#             message="User approved successfully"
#         )
        
#     except Exception as e:
#         print(f"Error in approve_user: {e}")
#         return response_handler(error="Internal server error", status_code=500)

def approve_user(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID format", status_code=400)

        result = User.update_by_id(user_id, {
            'status': 'approved',
            'approved': True,
            'approvedByCoach': True,   # ✅ ADD THIS
            'approvalStatus': 'approved'
        })

        if result.matched_count == 0:
            return response_handler(error="User not found", status_code=404)

        updated_user = User.find_by_id(user_id)

        if updated_user and 'password' in updated_user:
            del updated_user['password']

        updated_user['_id'] = str(updated_user['_id'])

        return response_handler(
            data=updated_user,
            message="User approved successfully"
        )

    except Exception as e:
        print(f"Error in approve_user: {e}")
        return response_handler(error="Internal server error", status_code=500)


def reject_user(user_id):
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID format", status_code=400)
            
        result = User.update_by_id(user_id, {
            'status': 'rejected',
            'approvalStatus': 'rejected'
        })
        
        if result.matched_count == 0:
            return response_handler(error="User not found", status_code=404)
        
        updated_user = User.find_by_id(user_id)
        if updated_user and 'password' in updated_user:
            del updated_user['password']
        updated_user['_id'] = str(updated_user['_id'])
        
        return response_handler(
            data=updated_user,
            message="User rejected successfully"
        )
        
    except Exception as e:
        print(f"Error in reject_user: {e}")
        return response_handler(error="Internal server error", status_code=500)

def admin_check():
    try:
        admin = User.find_one({'role': 'admin'})
        return response_handler(data={'adminExists': admin is not None})
    except Exception as e:
        print(f"Error in admin_check: {e}")
        return response_handler(error="Error checking admin", status_code=500)