# from flask import Blueprint
# from app.controllers.team_controller import *
# from app.middleware.auth import auth, role

# team_bp = Blueprint('team', __name__)

# # Public routes
# team_bp.route('/', methods=['GET'])(get_teams)
# team_bp.route('/pending-teams', methods=['GET'])(get_pending_teams)
# team_bp.route('/approved-teams', methods=['GET'])(get_approved_teams)

# # Protected routes
# @team_bp.route('/teams', methods=['POST'])
# @auth
# def create_team_route():
#     return create_team()

# @team_bp.route('/<team_id>/join', methods=['POST'])
# @auth
# def join_team_route(team_id):
#     return join_team(team_id)

# @team_bp.route('/<team_id>/leave', methods=['POST'])
# @auth
# def leave_team_route(team_id):
#     return leave_team(team_id)

# @team_bp.route('/<team_id>', methods=['PATCH'])
# @auth
# def update_team_route(team_id):
#     return update_team(team_id)

# @team_bp.route('/<team_id>', methods=['DELETE'])
# @auth
# def delete_team_route(team_id):
#     return delete_team(team_id)

# @team_bp.route('/approve/<team_id>', methods=['PATCH'])
# @auth
# @role('admin')
# def approve_team_route(team_id):
#     return approve_team(team_id)




from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.team_controller import *
from app.middleware.auth import role

team_bp = Blueprint('team', __name__)

# ========== PUBLIC ROUTES ==========
@team_bp.route('/', methods=['GET'])
def get_teams_route():
    """Get all teams - public"""
    return get_teams()

@team_bp.route('/pending-teams', methods=['GET'])
def get_pending_teams_route():
    """Get pending teams - public"""
    return get_pending_teams()

@team_bp.route('/approved-teams', methods=['GET'])
def get_approved_teams_route():
    """Get approved teams - public"""
    return get_approved_teams()

# ========== PROTECTED ROUTES ==========
@team_bp.route('/teams', methods=['POST'])
@jwt_required()
def create_team_route():
    """Create team - authenticated users only"""
    return create_team()

@team_bp.route('/<team_id>/join', methods=['POST'])
@jwt_required()
def join_team_route(team_id):
    """Join team - authenticated users only"""
    return join_team(team_id)

@team_bp.route('/<team_id>/leave', methods=['POST'])
@jwt_required()
def leave_team_route(team_id):
    """Leave team - authenticated users only"""
    return leave_team(team_id)

@team_bp.route('/<team_id>', methods=['PATCH'])
@jwt_required()
def update_team_route(team_id):
    """Update team - authenticated users only"""
    return update_team(team_id)

@team_bp.route('/<team_id>', methods=['DELETE'])
@jwt_required()
def delete_team_route(team_id):
    """Delete team - authenticated users only"""
    return delete_team(team_id)

@team_bp.route('/approve/<team_id>', methods=['PATCH'])
@jwt_required()
@role('admin')
def approve_team_route(team_id):
    """Approve team - admin only"""
    return approve_team(team_id)