
from flask import request
from app.models.team import Team
from app.models.user import User
from app.response_handler import response_handler
from bson import ObjectId
from flask_jwt_extended import get_jwt_identity


def get_teams():
    try:
        teams = Team.find()

        formatted_teams = []
        for team in teams:
            team['_id'] = str(team['_id'])

            # Populate members
            if 'members' in team and team['members']:
                members = []
                for member_id in team['members']:
                    member = User.find_by_id(member_id)
                    if member:
                        members.append({
                            '_id': str(member['_id']),
                            'name': member.get('name'),
                            'email': member.get('email')
                        })
                team['members'] = members

            # Populate coach
            if 'coach' in team and team['coach']:
                coach = User.find_by_id(team['coach'])
                if coach:
                    team['coach'] = {
                        '_id': str(coach['_id']),
                        'name': coach.get('name'),
                        'email': coach.get('email')
                    }

            formatted_teams.append(team)

        return response_handler(data={'teams': formatted_teams})

    except Exception as e:
        return response_handler(
            error=f"Error fetching teams: {str(e)}",
            status_code=500
        )


def create_team():
    try:
        data = request.get_json()

        name = data.get('name')
        sport = data.get('sport')
        members = data.get('members', [])

        if not name or not sport or not members:
            return response_handler(
                error="Name, sport, and members are required",
                status_code=400
            )

        # Get current user
        current_user_id = get_jwt_identity()

        if not current_user_id:
            return response_handler(
                error="User not authenticated",
                status_code=401
            )

        team_data = {
            'name': name,
            'sport': sport,
            'members': [ObjectId(m) for m in members],
            'coach': ObjectId(current_user_id),
            'createdBy': ObjectId(current_user_id),
            'approved': False
        }

        team_id = Team.create(team_data)

        return response_handler(
            data={'team_id': str(team_id)},
            status_code=201,
            message="Team created successfully"
        )

    except Exception as e:
        print(f"Error in createTeam: {e}")
        return response_handler(
            error="Internal Server Error",
            status_code=500
        )


# def get_pending_teams():
#     try:
#         teams = Team.find({'approved': False})

#         formatted = []
#         for team in teams:
#             team['_id'] = str(team['_id'])
#             formatted.append(team)

#         return response_handler(data=formatted)

#     except Exception as e:
#         return response_handler(
#             error=f"Error fetching pending teams: {str(e)}",
#             status_code=500
#         )


def get_pending_teams():
    try:
        teams = Team.find({'approved': False})

        formatted = []

        for team in teams:
            team['_id'] = str(team['_id'])

            # convert createdBy
            if team.get('createdBy'):
                team['createdBy'] = str(team['createdBy'])

            # convert coach
            if team.get('coach'):
                team['coach'] = str(team['coach'])

            # convert members
            if team.get('members'):
                team['members'] = [str(m) for m in team['members']]

            formatted.append(team)

        return response_handler(data=formatted)

    except Exception as e:
        return response_handler(
            error=f"Error fetching pending teams: {str(e)}",
            status_code=500
        )



# def get_approved_teams():
#     try:
#         teams = Team.find({'approved': True})

#         formatted = []
#         for team in teams:
#             team['_id'] = str(team['_id'])
#             formatted.append(team)

#         return response_handler(data=formatted)

#     except Exception as e:
#         return response_handler(
#             error=f"Error fetching approved teams: {str(e)}",
#             status_code=500
#         )


def get_approved_teams():
    try:
        teams = Team.find({'approved': True})

        formatted = []

        for team in teams:
            team['_id'] = str(team['_id'])

            if team.get('createdBy'):
                team['createdBy'] = str(team['createdBy'])

            if team.get('coach'):
                team['coach'] = str(team['coach'])

            if team.get('members'):
                team['members'] = [str(m) for m in team['members']]

            formatted.append(team)

        return response_handler(data=formatted)

    except Exception as e:
        return response_handler(
            error=f"Error fetching approved teams: {str(e)}",
            status_code=500
        )

def approve_team(team_id):
    try:
        result = Team.update_by_id(team_id, {'approved': True})

        if result.modified_count == 0:
            return response_handler(
                error="Team not found",
                status_code=404
            )

        return response_handler(message="Team approved successfully")

    except Exception as e:
        return response_handler(
            error=f"Error approving team: {str(e)}",
            status_code=500
        )


def join_team(team_id):
    try:
        team = Team.find_by_id(team_id)

        if not team:
            return response_handler(
                error="Team not found",
                status_code=404
            )

        current_user_id = get_jwt_identity()

        if not current_user_id:
            return response_handler(
                error="User not authenticated",
                status_code=401
            )

        user_id = ObjectId(current_user_id)

        # Check if already member
        if user_id in team.get('members', []):
            return response_handler(
                error="Already a member",
                status_code=400
            )

        Team.update_by_id(team_id, {
            'members': team['members'] + [user_id]
        })

        return response_handler(message="Joined team successfully")

    except Exception as e:
        print(f"Join team error: {e}")
        return response_handler(
            error="Error joining team",
            status_code=500
        )


def leave_team(team_id):
    try:
        team = Team.find_by_id(team_id)

        if not team:
            return response_handler(
                error="Team not found",
                status_code=404
            )

        current_user_id = get_jwt_identity()

        if not current_user_id:
            return response_handler(
                error="User not authenticated",
                status_code=401
            )

        user_id = ObjectId(current_user_id)

        members = [m for m in team.get('members', []) if m != user_id]

        Team.update_by_id(team_id, {'members': members})

        return response_handler(message="Left team successfully")

    except Exception as e:
        return response_handler(
            error=f"Error leaving team: {str(e)}",
            status_code=500
        )


def update_team(team_id):
    try:
        team = Team.find_by_id(team_id)

        if not team:
            return response_handler(
                error="Team not found",
                status_code=404
            )

        current_user_id = get_jwt_identity()

        if not current_user_id:
            return response_handler(
                error="User not authenticated",
                status_code=401
            )

        if str(team.get('coach')) != current_user_id:
            return response_handler(
                error="Only coach can update team",
                status_code=403
            )

        data = request.get_json()

        update_data = {}

        if 'name' in data:
            update_data['name'] = data['name']

        if 'sport' in data:
            update_data['sport'] = data['sport']

        Team.update_by_id(team_id, update_data)

        return response_handler(message="Team updated successfully")

    except Exception as e:
        return response_handler(
            error=f"Error updating team: {str(e)}",
            status_code=500
        )


def delete_team(team_id):
    try:
        team = Team.find_by_id(team_id)

        if not team:
            return response_handler(
                error="Team not found",
                status_code=404
            )

        current_user_id = get_jwt_identity()

        if not current_user_id:
            return response_handler(
                error="User not authenticated",
                status_code=401
            )

        if str(team.get('coach')) != current_user_id:
            return response_handler(
                error="Only coach can delete team",
                status_code=403
            )

        Team.delete_by_id(team_id)

        return response_handler(message="Team deleted successfully")

    except Exception as e:
        return response_handler(
            error=f"Error deleting team: {str(e)}",
            status_code=500
        )