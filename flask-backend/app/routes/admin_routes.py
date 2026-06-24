from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.user_controller import get_all_users
from app.controllers.admin_controller import (
    admin_get_coaches, admin_add_coach, admin_block_coach, admin_delete_coach,
    admin_get_participants, admin_add_participant, admin_block_participant, admin_delete_participant,
    admin_get_teams, admin_block_team, admin_delete_team,
)
from app.middleware.auth import role

admin_bp = Blueprint('admin', __name__)

# ── existing ──────────────────────────────────
@admin_bp.route('/getUsers', methods=['GET'])
@jwt_required()
@role('admin')
def get_users_route():
    return get_all_users()

# ── coaches ───────────────────────────────────
@admin_bp.route('/coaches', methods=['GET'])
@jwt_required()
@role('admin')
def get_coaches_route():
    return admin_get_coaches()

@admin_bp.route('/coaches', methods=['POST'])
@jwt_required()
@role('admin')
def add_coach_route():
    return admin_add_coach()

@admin_bp.route('/coaches/<user_id>/block', methods=['PATCH'])
@jwt_required()
@role('admin')
def block_coach_route(user_id):
    return admin_block_coach(user_id)

@admin_bp.route('/coaches/<user_id>', methods=['DELETE'])
@jwt_required()
@role('admin')
def delete_coach_route(user_id):
    return admin_delete_coach(user_id)

# ── participants ──────────────────────────────
@admin_bp.route('/participants', methods=['GET'])
@jwt_required()
@role('admin')
def get_participants_route():
    return admin_get_participants()

@admin_bp.route('/participants', methods=['POST'])
@jwt_required()
@role('admin')
def add_participant_route():
    return admin_add_participant()

@admin_bp.route('/participants/<user_id>/block', methods=['PATCH'])
@jwt_required()
@role('admin')
def block_participant_route(user_id):
    return admin_block_participant(user_id)

@admin_bp.route('/participants/<user_id>', methods=['DELETE'])
@jwt_required()
@role('admin')
def delete_participant_route(user_id):
    return admin_delete_participant(user_id)

# ── teams ─────────────────────────────────────
@admin_bp.route('/teams', methods=['GET'])
@jwt_required()
@role('admin')
def get_teams_route():
    return admin_get_teams()

@admin_bp.route('/teams/<team_id>/block', methods=['PATCH'])
@jwt_required()
@role('admin')
def block_team_route(team_id):
    return admin_block_team(team_id)

@admin_bp.route('/teams/<team_id>', methods=['DELETE'])
@jwt_required()
@role('admin')
def delete_team_route(team_id):
    return admin_delete_team(team_id)