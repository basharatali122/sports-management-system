
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