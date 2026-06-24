from flask import request
from flask_jwt_extended import get_jwt_identity
from app.models.user import User
from app.models.team import Team
from app.response_handler import response_handler
from bson import ObjectId
import bcrypt
from datetime import datetime


# ─────────────────────────────────────────────
#  COACHES
# ─────────────────────────────────────────────

def admin_get_coaches():
    try:
        coaches = User.find({'role': 'coach'})
        formatted = []
        for c in coaches:
            c['_id'] = str(c['_id'])
            c.pop('password', None)
            formatted.append(c)
        return response_handler(data=formatted, message="Coaches fetched successfully")
    except Exception as e:
        print(f"Error in admin_get_coaches: {e}")
        return response_handler(error="Server error", status_code=500)


def admin_add_coach():
    """Admin creates a coach — auto-approved, bypasses pending flow"""
    try:
        data = request.get_json()
        name     = (data.get('name') or '').strip()
        email    = (data.get('email') or '').strip().lower()
        password = data.get('password')
        sport    = data.get('sport')

        valid_sports = ['Cricket', 'Football', 'Tennis', 'Hockey']

        # Validation
        if not name or not email or not password or not sport:
            return response_handler(error="Name, email, password, and sport are required", status_code=400)

        if sport not in valid_sports:
            return response_handler(
                error=f"Invalid sport. Choose from: {', '.join(valid_sports)}",
                status_code=400
            )

        if User.find_one({'email': email}):
            return response_handler(error="A user with this email already exists", status_code=409)

        # Check if an approved coach for this sport already exists
        existing = User.find_one({'role': 'coach', 'sport': sport, 'status': 'approved'})
        if existing:
            return response_handler(error=f"An approved coach for {sport} already exists", status_code=409)

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_data = {
            'name':            name,
            'email':           email,
            'password':        hashed,
            'role':            'coach',
            'sport':           sport,
            'accountStatus':   'active',
            'approved':        True,       # admin-created = pre-approved
            'approvedByCoach': True,
            'approvalStatus':  'approved',
            'status':          'approved',
            'created_at':      datetime.utcnow(),
        }

        user_id  = User.create(user_data)
        new_user = User.find_by_id(user_id)
        new_user.pop('password', None)
        new_user['_id'] = str(new_user['_id'])

        return response_handler(data=new_user, message="Coach created successfully", status_code=201)

    except Exception as e:
        print(f"Error in admin_add_coach: {e}")
        import traceback; traceback.print_exc()
        return response_handler(error="Internal server error", status_code=500)


def admin_block_coach(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID", status_code=400)
        coach = User.find_by_id(user_id)
        if not coach or coach.get('role') != 'coach':
            return response_handler(error="Coach not found", status_code=404)

        new_status = 'blocked' if coach.get('accountStatus') != 'blocked' else 'active'
        User.update_by_id(user_id, {'accountStatus': new_status})

        updated = User.find_by_id(user_id)
        updated['_id'] = str(updated['_id'])
        updated.pop('password', None)

        msg = "Coach blocked successfully" if new_status == 'blocked' else "Coach unblocked successfully"
        return response_handler(data=updated, message=msg)
    except Exception as e:
        print(f"Error in admin_block_coach: {e}")
        return response_handler(error="Server error", status_code=500)


def admin_delete_coach(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID", status_code=400)
        coach = User.find_by_id(user_id)
        if not coach or coach.get('role') != 'coach':
            return response_handler(error="Coach not found", status_code=404)
        User.delete_by_id(user_id)
        return response_handler(message="Coach deleted successfully")
    except Exception as e:
        print(f"Error in admin_delete_coach: {e}")
        return response_handler(error="Server error", status_code=500)


# ─────────────────────────────────────────────
#  PARTICIPANTS
# ─────────────────────────────────────────────

def admin_get_participants():
    try:
        participants = User.find({'role': 'participant'})
        formatted = []
        for p in participants:
            p['_id'] = str(p['_id'])
            p.pop('password', None)
            formatted.append(p)
        return response_handler(data=formatted, message="Participants fetched successfully")
    except Exception as e:
        print(f"Error in admin_get_participants: {e}")
        return response_handler(error="Server error", status_code=500)


def admin_add_participant():
    """Admin creates a participant — auto-approved, bypasses pending flow"""
    try:
        data = request.get_json()
        name              = (data.get('name') or '').strip()
        email             = (data.get('email') or '').strip().lower()
        password          = data.get('password')
        sports_prefs      = data.get('sportsPreferences', [])

        valid_sports = ['Cricket', 'Football', 'Tennis', 'Hockey']

        if not name or not email or not password:
            return response_handler(error="Name, email, and password are required", status_code=400)

        if not isinstance(sports_prefs, list) or len(sports_prefs) == 0:
            return response_handler(error="At least one sport preference is required", status_code=400)

        if len(sports_prefs) > 2:
            return response_handler(error="Maximum 2 sport preferences allowed", status_code=400)

        for s in sports_prefs:
            if s not in valid_sports:
                return response_handler(error=f"Invalid sport: {s}", status_code=400)

        if User.find_one({'email': email}):
            return response_handler(error="A user with this email already exists", status_code=409)

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_data = {
            'name':             name,
            'email':            email,
            'password':         hashed,
            'role':             'participant',
            'sportsPreferences': sports_prefs,
            'accountStatus':    'active',
            'approved':         True,      # admin-created = pre-approved
            'approvedByCoach':  True,
            'approvalStatus':   'approved',
            'status':           'approved',
            'created_at':       datetime.utcnow(),
        }

        user_id  = User.create(user_data)
        new_user = User.find_by_id(user_id)
        new_user.pop('password', None)
        new_user['_id'] = str(new_user['_id'])

        return response_handler(data=new_user, message="Participant created successfully", status_code=201)

    except Exception as e:
        print(f"Error in admin_add_participant: {e}")
        import traceback; traceback.print_exc()
        return response_handler(error="Internal server error", status_code=500)


def admin_block_participant(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID", status_code=400)
        participant = User.find_by_id(user_id)
        if not participant or participant.get('role') != 'participant':
            return response_handler(error="Participant not found", status_code=404)

        new_status = 'blocked' if participant.get('accountStatus') != 'blocked' else 'active'
        User.update_by_id(user_id, {'accountStatus': new_status})

        updated = User.find_by_id(user_id)
        updated['_id'] = str(updated['_id'])
        updated.pop('password', None)

        msg = "Participant blocked" if new_status == 'blocked' else "Participant unblocked"
        return response_handler(data=updated, message=msg)
    except Exception as e:
        print(f"Error in admin_block_participant: {e}")
        return response_handler(error="Server error", status_code=500)


def admin_delete_participant(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID", status_code=400)
        participant = User.find_by_id(user_id)
        if not participant or participant.get('role') != 'participant':
            return response_handler(error="Participant not found", status_code=404)
        User.delete_by_id(user_id)
        return response_handler(message="Participant deleted successfully")
    except Exception as e:
        print(f"Error in admin_delete_participant: {e}")
        return response_handler(error="Server error", status_code=500)


# ─────────────────────────────────────────────
#  TEAMS
# ─────────────────────────────────────────────

def _fmt_team(t):
    t['_id'] = str(t['_id'])
    if t.get('coach_id'):
        t['coach_id'] = str(t['coach_id'])
    if isinstance(t.get('members'), list):
        t['members'] = [str(m) for m in t['members']]
    return t




# def admin_get_teams():
#     try:
#         teams = Team.find()
#         return response_handler(data=[_fmt_team(t) for t in teams], message="Teams fetched successfully")
#     except Exception as e:
#         print(f"Error in admin_get_teams: {e}")
#         return response_handler(error="Server error", status_code=500)


# def admin_block_team(team_id):
#     try:
#         if not ObjectId.is_valid(team_id):
#             return response_handler(error="Invalid team ID", status_code=400)
#         team = Team.find_by_id(team_id)
#         if not team:
#             return response_handler(error="Team not found", status_code=404)

#         new_status = 'blocked' if team.get('status') != 'blocked' else 'active'
#         Team.update_by_id(team_id, {'status': new_status})

#         updated = _fmt_team(Team.find_by_id(team_id))
#         msg = "Team blocked" if new_status == 'blocked' else "Team unblocked"
#         return response_handler(data=updated, message=msg)
#     except Exception as e:
#         print(f"Error in admin_block_team: {e}")
#         return response_handler(error="Server error", status_code=500)


# def admin_delete_team(team_id):
#     try:
#         if not ObjectId.is_valid(team_id):
#             return response_handler(error="Invalid team ID", status_code=400)
#         if not Team.find_by_id(team_id):
#             return response_handler(error="Team not found", status_code=404)
#         Team.delete_by_id(team_id)
#         return response_handler(message="Team deleted successfully")
#     except Exception as e:
#         print(f"Error in admin_delete_team: {e}")
#         return response_handler(error="Server error", status_code=500)




# ─────────────────────────────────────────────
#  TEAMS
# ─────────────────────────────────────────────

def admin_get_teams():
    """Get all teams"""
    try:
        teams = Team.find()
        formatted = []
        for t in teams:
            # Convert all ObjectIds to strings recursively
            t = convert_objectids_to_strings(t)
            formatted.append(t)
        return response_handler(data=formatted, message="Teams fetched successfully")
    except Exception as e:
        print(f"Error in admin_get_teams: {e}")
        return response_handler(error="Server error", status_code=500)


def convert_objectids_to_strings(obj):
    """Recursively convert all ObjectId instances to strings"""
    if isinstance(obj, dict):
        return {k: convert_objectids_to_strings(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectids_to_strings(item) for item in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return obj


def admin_block_team(team_id):
    """Block or unblock a team (toggle)"""
    try:
        if not ObjectId.is_valid(team_id):
            return response_handler(error="Invalid team ID", status_code=400)

        team = Team.find_by_id(team_id)
        if not team:
            return response_handler(error="Team not found", status_code=404)

        new_status = 'blocked' if team.get('status') != 'blocked' else 'active'
        Team.update_by_id(team_id, {'status': new_status})

        updated = Team.find_by_id(team_id)
        updated = convert_objectids_to_strings(updated)

        msg = "Team blocked successfully" if new_status == 'blocked' else "Team unblocked successfully"
        return response_handler(data=updated, message=msg)
    except Exception as e:
        print(f"Error in admin_block_team: {e}")
        return response_handler(error="Server error", status_code=500)


def admin_delete_team(team_id):
    """Permanently delete a team"""
    try:
        if not ObjectId.is_valid(team_id):
            return response_handler(error="Invalid team ID", status_code=400)

        team = Team.find_by_id(team_id)
        if not team:
            return response_handler(error="Team not found", status_code=404)

        Team.delete_by_id(team_id)
        return response_handler(message="Team deleted successfully")
    except Exception as e:
        print(f"Error in admin_delete_team: {e}")
        return response_handler(error="Server error", status_code=500)