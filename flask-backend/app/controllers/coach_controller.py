from flask import request
from flask_jwt_extended import get_jwt_identity
from app.models.user import User
from app.models.event import Event
from app.models.event_registration import EventRegistration
from app.response_handler import response_handler
from bson import ObjectId
from datetime import datetime


def _str_ids(obj):
    """Recursively convert ObjectId to str in dict/list."""
    if isinstance(obj, dict):
        return {k: _str_ids(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_str_ids(i) for i in obj]
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj


# ─────────────────────────────────────────────────────────
#  Helper: get authenticated coach + their sport
# ─────────────────────────────────────────────────────────

def _get_coach():
    """Returns (coach_doc, sport) or raises."""
    coach_id = get_jwt_identity()
    if not coach_id:
        return None, None
    coach = User.find_by_id(coach_id)
    if not coach or coach.get('role') != 'coach':
        return None, None
    return coach, coach.get('sport')


# ─────────────────────────────────────────────────────────
#  GET participants of coach's sport
# ─────────────────────────────────────────────────────────

def coach_get_sport_participants():
    """
    Return all participants whose sportsPreferences includes this coach's sport.
    Also returns participants with approvalStatus='pending-coach' for approval queue.
    """
    try:
        coach, sport = _get_coach()
        if not coach:
            return response_handler(error="Unauthorized", status_code=403)

        # All participants whose preferences include this sport
        all_participants = User.find({'role': 'participant'})
        relevant = []
        for p in all_participants:
            prefs = p.get('sportsPreferences', [])
            if sport in prefs:
                p.pop('password', None)
                relevant.append(_str_ids(p))

        return response_handler(
            data={'participants': relevant, 'sport': sport},
            message=f"Participants for {sport} fetched successfully"
        )
    except Exception as e:
        print(f"coach_get_sport_participants error: {e}")
        return response_handler(error="Server error", status_code=500)


# ─────────────────────────────────────────────────────────
#  APPROVE / REJECT participant (coach's sport only)
# ─────────────────────────────────────────────────────────

def coach_approve_participant(user_id):
    try:
        coach, sport = _get_coach()
        if not coach:
            return response_handler(error="Unauthorized", status_code=403)

        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID", status_code=400)

        participant = User.find_by_id(user_id)
        if not participant or participant.get('role') != 'participant':
            return response_handler(error="Participant not found", status_code=404)

        # Verify sport match
        if sport not in participant.get('sportsPreferences', []):
            return response_handler(
                error=f"This participant is not in your sport ({sport})",
                status_code=403
            )

        User.update_by_id(user_id, {
            'approvedByCoach': True,
            'approved': True,
            'approvalStatus': 'approved',
            'status': 'approved',
        })

        updated = User.find_by_id(user_id)
        updated.pop('password', None)
        return response_handler(data=_str_ids(updated), message="Participant approved")
    except Exception as e:
        print(f"coach_approve_participant error: {e}")
        return response_handler(error="Server error", status_code=500)


def coach_reject_participant(user_id):
    try:
        coach, sport = _get_coach()
        if not coach:
            return response_handler(error="Unauthorized", status_code=403)

        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID", status_code=400)

        participant = User.find_by_id(user_id)
        if not participant or participant.get('role') != 'participant':
            return response_handler(error="Participant not found", status_code=404)

        if sport not in participant.get('sportsPreferences', []):
            return response_handler(
                error=f"This participant is not in your sport ({sport})",
                status_code=403
            )

        User.update_by_id(user_id, {
            'approvedByCoach': False,
            'approved': False,
            'approvalStatus': 'rejected',
            'status': 'rejected',
        })

        updated = User.find_by_id(user_id)
        updated.pop('password', None)
        return response_handler(data=_str_ids(updated), message="Participant rejected")
    except Exception as e:
        print(f"coach_reject_participant error: {e}")
        return response_handler(error="Server error", status_code=500)


# ─────────────────────────────────────────────────────────
#  UPDATE participant profile (coach's sport only)
# ─────────────────────────────────────────────────────────

def coach_update_participant(user_id):
    """
    Coach can update: name, sportsPreferences, achievements, bio.
    Cannot change email, password, or role.
    """
    try:
        coach, sport = _get_coach()
        if not coach:
            return response_handler(error="Unauthorized", status_code=403)

        if not ObjectId.is_valid(user_id):
            return response_handler(error="Invalid user ID", status_code=400)

        participant = User.find_by_id(user_id)
        if not participant or participant.get('role') != 'participant':
            return response_handler(error="Participant not found", status_code=404)

        # Enforce sport restriction
        if sport not in participant.get('sportsPreferences', []):
            return response_handler(
                error=f"You can only update participants in your sport ({sport})",
                status_code=403
            )

        data = request.get_json() or {}
        allowed_fields = ['name', 'sportsPreferences', 'achievements', 'bio', 'phone', 'age']
        update_data = {k: data[k] for k in allowed_fields if k in data}

        # Validate sportsPreferences if provided
        if 'sportsPreferences' in update_data:
            valid_sports = ['Cricket', 'Football', 'Tennis', 'Hockey']
            prefs = update_data['sportsPreferences']
            if not isinstance(prefs, list) or not (1 <= len(prefs) <= 2):
                return response_handler(error="sportsPreferences must be a list of 1–2 sports", status_code=400)
            for s in prefs:
                if s not in valid_sports:
                    return response_handler(error=f"Invalid sport: {s}", status_code=400)

        if not update_data:
            return response_handler(error="No valid fields to update", status_code=400)

        User.update_by_id(user_id, update_data)

        updated = User.find_by_id(user_id)
        updated.pop('password', None)
        return response_handler(data=_str_ids(updated), message="Participant profile updated")
    except Exception as e:
        print(f"coach_update_participant error: {e}")
        return response_handler(error="Server error", status_code=500)


# ─────────────────────────────────────────────────────────
#  GET coach's own events (for invite panel)
# ─────────────────────────────────────────────────────────

def coach_get_my_events():
    try:
        coach, sport = _get_coach()
        if not coach:
            return response_handler(error="Unauthorized", status_code=403)

        coach_obj_id = ObjectId(get_jwt_identity())
        events = Event.find({'createdBy': coach_obj_id})

        formatted = []
        for e in events:
            # Count current invitees
            invitees = e.get('invitedParticipants', [])
            formatted.append({
                '_id':        str(e['_id']),
                'title':      e.get('title'),
                'location':   e.get('location'),
                'startDate':  e['startDate'].isoformat() if e.get('startDate') else None,
                'endDate':    e['endDate'].isoformat() if e.get('endDate') else None,
                'approved':   e.get('approved', False),
                'invitedCount': len(invitees),
            })

        return response_handler(data=formatted, message="Your events fetched")
    except Exception as e:
        print(f"coach_get_my_events error: {e}")
        return response_handler(error="Server error", status_code=500)


# ─────────────────────────────────────────────────────────
#  INVITE participant(s) to an event
# ─────────────────────────────────────────────────────────

def coach_invite_participants(event_id):
    """
    Body: { "participant_ids": ["id1", "id2", ...] }
    Adds them to event.invitedParticipants (separate from self-registration).
    Coach can only invite participants from their own sport.
    Coach must own the event.
    """
    try:
        coach, sport = _get_coach()
        if not coach:
            return response_handler(error="Unauthorized", status_code=403)

        if not ObjectId.is_valid(event_id):
            return response_handler(error="Invalid event ID", status_code=400)

        event = Event.find_by_id(event_id)
        if not event:
            return response_handler(error="Event not found", status_code=404)

        coach_id = get_jwt_identity()
        if str(event.get('createdBy')) != coach_id:
            return response_handler(error="You can only invite to your own events", status_code=403)

        data = request.get_json() or {}
        participant_ids = data.get('participant_ids', [])

        if not participant_ids:
            return response_handler(error="participant_ids list is required", status_code=400)

        added = []
        skipped = []
        errors = []

        existing_invited = [str(x) for x in event.get('invitedParticipants', [])]

        for pid in participant_ids:
            if not ObjectId.is_valid(pid):
                errors.append(f"Invalid ID: {pid}")
                continue

            p = User.find_by_id(pid)
            if not p or p.get('role') != 'participant':
                errors.append(f"Participant {pid} not found")
                continue

            if sport not in p.get('sportsPreferences', []):
                errors.append(f"{p.get('name', pid)} is not in your sport ({sport})")
                continue

            if pid in existing_invited:
                skipped.append(p.get('name', pid))
                continue

            # Add to invitedParticipants using $addToSet
            Event.get_collection().update_one(
                {'_id': ObjectId(event_id)},
                {'$addToSet': {'invitedParticipants': ObjectId(pid)}}
            )
            added.append(p.get('name', pid))

        return response_handler(
            data={'added': added, 'skipped': skipped, 'errors': errors},
            message=f"{len(added)} participant(s) invited successfully"
        )
    except Exception as e:
        print(f"coach_invite_participants error: {e}")
        import traceback; traceback.print_exc()
        return response_handler(error="Server error", status_code=500)


# ─────────────────────────────────────────────────────────
#  GET invitees of a specific event
# ─────────────────────────────────────────────────────────

def coach_get_event_invitees(event_id):
    try:
        coach, sport = _get_coach()
        if not coach:
            return response_handler(error="Unauthorized", status_code=403)

        if not ObjectId.is_valid(event_id):
            return response_handler(error="Invalid event ID", status_code=400)

        event = Event.find_by_id(event_id)
        if not event:
            return response_handler(error="Event not found", status_code=404)

        if str(event.get('createdBy')) != get_jwt_identity():
            return response_handler(error="Access denied", status_code=403)

        invitee_ids = event.get('invitedParticipants', [])
        invitees = []
        for pid in invitee_ids:
            p = User.find_by_id(pid)
            if p:
                p.pop('password', None)
                invitees.append(_str_ids(p))

        return response_handler(data=invitees, message="Invitees fetched")
    except Exception as e:
        print(f"coach_get_event_invitees error: {e}")
        return response_handler(error="Server error", status_code=500)


# ─────────────────────────────────────────────────────────
#  REMOVE invite
# ─────────────────────────────────────────────────────────

def coach_remove_invitee(event_id, participant_id):
    try:
        coach, _ = _get_coach()
        if not coach:
            return response_handler(error="Unauthorized", status_code=403)

        if not ObjectId.is_valid(event_id) or not ObjectId.is_valid(participant_id):
            return response_handler(error="Invalid ID", status_code=400)

        event = Event.find_by_id(event_id)
        if not event:
            return response_handler(error="Event not found", status_code=404)

        if str(event.get('createdBy')) != get_jwt_identity():
            return response_handler(error="Access denied", status_code=403)

        Event.get_collection().update_one(
            {'_id': ObjectId(event_id)},
            {'$pull': {'invitedParticipants': ObjectId(participant_id)}}
        )
        return response_handler(message="Invitee removed")
    except Exception as e:
        print(f"coach_remove_invitee error: {e}")
        return response_handler(error="Server error", status_code=500)