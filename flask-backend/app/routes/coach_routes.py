from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.middleware.auth import role
from app.controllers.coach_controller import (
    coach_get_sport_participants,
    coach_approve_participant,
    coach_reject_participant,
    coach_update_participant,
    coach_get_my_events,
    coach_invite_participants,
    coach_get_event_invitees,
    coach_remove_invitee,
)

coach_bp = Blueprint('coach', __name__)

# ── Participants (coach's sport only) ────────────────────
@coach_bp.route('/participants', methods=['GET'])
@jwt_required()
@role('coach')
def get_sport_participants():
    """Get all participants in the coach's sport"""
    return coach_get_sport_participants()

@coach_bp.route('/participants/<user_id>/approve', methods=['PATCH'])
@jwt_required()
@role('coach')
def approve_participant(user_id):
    """Approve a participant (sport-restricted)"""
    return coach_approve_participant(user_id)

@coach_bp.route('/participants/<user_id>/reject', methods=['PATCH'])
@jwt_required()
@role('coach')
def reject_participant(user_id):
    """Reject a participant (sport-restricted)"""
    return coach_reject_participant(user_id)

@coach_bp.route('/participants/<user_id>', methods=['PATCH'])
@jwt_required()
@role('coach')
def update_participant(user_id):
    """Update participant profile (sport-restricted)"""
    return coach_update_participant(user_id)

# ── Events + Invites ─────────────────────────────────────
@coach_bp.route('/events', methods=['GET'])
@jwt_required()
@role('coach')
def get_my_events():
    """Get coach's own events"""
    return coach_get_my_events()

@coach_bp.route('/events/<event_id>/invite', methods=['POST'])
@jwt_required()
@role('coach')
def invite_to_event(event_id):
    """Invite participants to an event"""
    return coach_invite_participants(event_id)

@coach_bp.route('/events/<event_id>/invitees', methods=['GET'])
@jwt_required()
@role('coach')
def get_invitees(event_id):
    """Get invitees of an event"""
    return coach_get_event_invitees(event_id)

@coach_bp.route('/events/<event_id>/invitees/<participant_id>', methods=['DELETE'])
@jwt_required()
@role('coach')
def remove_invitee(event_id, participant_id):
    """Remove a participant from event invitees"""
    return coach_remove_invitee(event_id, participant_id)