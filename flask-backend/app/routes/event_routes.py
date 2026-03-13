
from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.event_controller import *
from app.middleware.auth import role

event_bp = Blueprint('events', __name__)

# ========== PUBLIC ROUTES ==========
@event_bp.route('/', methods=['GET'])
def get_events_route():
    """Get events - public"""
    return get_events()

@event_bp.route('/getAllEvents', methods=['GET'])
def get_all_events_route():
    """Get all events - public"""
    return get_all_events()

@event_bp.route('/getEventById/<event_id>', methods=['GET'])
def get_event_by_id_route(event_id):
    """Get event by ID - public"""
    return get_event_by_id(event_id)

@event_bp.route('/getParticipantEvents', methods=['GET'])
def get_participant_events_route():
    """Get participant events - public"""
    return get_participant_events()

# ========== PROTECTED ROUTES ==========
@event_bp.route('/createEvent', methods=['POST'])
@jwt_required()
@role('coach', 'admin')
def create_event_route():
    """Create event - coaches and admins only"""
    return create_event()

@event_bp.route('/<event_id>/register', methods=['POST'])
@jwt_required()
@role('participant')
def register_event_route(event_id):
    """Register for event - participants only"""
    return register_for_event(event_id)

@event_bp.route('/<event_id>/leave', methods=['POST'])
@jwt_required()
@role('participant')
def leave_event_route(event_id):
    """Leave event - participants only"""
    return leave_event(event_id)

@event_bp.route('/<event_id>/approve', methods=['PATCH'])
@jwt_required()
@role('admin')
def approve_event_route(event_id):
    """Approve event - admin only"""
    return approve_event(event_id)

# ========== COACH ROUTES ==========
@event_bp.route('/coach/registrations', methods=['GET'])
@jwt_required()
@role('coach')
def coach_registrations_route():
    """Get coach registrations - coaches only"""
    return get_coach_registrations()

@event_bp.route('/coach/registrations/<registration_id>', methods=['PATCH'])
@jwt_required()
@role('coach')
def update_registration_route(registration_id):
    """Update registration status - coaches only"""
    return update_registration_status(registration_id)