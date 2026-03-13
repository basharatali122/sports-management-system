
from flask import request
from app.models.event import Event
from app.models.event_registration import EventRegistration
from app.models.user import User
from app.response_handler import response_handler
from bson import ObjectId
from datetime import datetime

def convert_objectid_to_str(obj):
    """Recursively convert ObjectId to string in dictionaries and lists"""
    if isinstance(obj, dict):
        for key, value in obj.items():
            if isinstance(value, ObjectId):
                obj[key] = str(value)
            elif isinstance(value, (dict, list)):
                convert_objectid_to_str(value)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            if isinstance(item, ObjectId):
                obj[i] = str(item)
            elif isinstance(item, (dict, list)):
                convert_objectid_to_str(item)
    return obj

def get_all_events():
    try:
        events = Event.find()
        formatted_events = []
        for event in events:
            # 🔥 Convert all ObjectId fields to strings
            event = convert_objectid_to_str(event)
            formatted_events.append(event)
        return response_handler(data=formatted_events)
    except Exception as e:
        print(f"Error in get_all_events: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(error=f"Error fetching events: {str(e)}", status_code=500)

def get_events():
    try:
        events = Event.find({'approved': False})
        formatted_events = []
        for event in events:
            # 🔥 Convert all ObjectId fields to strings
            event = convert_objectid_to_str(event)
            formatted_events.append(event)
        return response_handler(data=formatted_events)
    except Exception as e:
        print(f"Error in get_events: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(error=f"Error fetching events: {str(e)}", status_code=500)

def get_participant_events():
    try:
        events = Event.find({'approved': True})
        formatted_events = []
        for event in events:
            # 🔥 Convert all ObjectId fields to strings
            event = convert_objectid_to_str(event)
            formatted_events.append(event)
        return response_handler(data=formatted_events)
    except Exception as e:
        print(f"Error in get_participant_events: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(error=f"Error fetching events: {str(e)}", status_code=500)

def get_event_by_id(event_id):
    try:
        event = Event.find_by_id(event_id)
        if not event:
            return response_handler(error="Event not found", status_code=404)
        
        # 🔥 Convert all ObjectId fields to strings
        event = convert_objectid_to_str(event)
        return response_handler(data=event)
    except Exception as e:
        print(f"Error in get_event_by_id: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(error=f"Error fetching event: {str(e)}", status_code=500)

def create_event():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'startDate', 'endDate', 'time', 'location', 'name']
        for field in required_fields:
            if not data.get(field):
                return response_handler(
                    error=f"Missing required field: {field}",
                    status_code=422
                )
        
        # Get current user from JWT
        from flask_jwt_extended import get_jwt_identity
        current_user_id = get_jwt_identity()
        
        if not current_user_id:
            return response_handler(error="User not authenticated", status_code=401)
        
        # Parse dates
        try:
            start_date = datetime.fromisoformat(data.get('startDate').replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(data.get('endDate').replace('Z', '+00:00'))
        except Exception as e:
            return response_handler(error=f"Invalid date format: {str(e)}", status_code=422)
        
        event_data = {
            'title': data.get('title'),
            'description': data.get('description'),
            'startDate': start_date,
            'endDate': end_date,
            'time': data.get('time'),
            'location': data.get('location'),
            'organizer': data.get('name'),
            'createdBy': ObjectId(current_user_id),
            'approved': False,
            'participants': [],
            'created_at': datetime.utcnow()
        }
        
        event_id = Event.create(event_data)
        
        return response_handler(
            data={'event_id': str(event_id)},
            status_code=201,
            message="Event created successfully"
        )
        
    except Exception as e:
        print(f"Error in createEvent: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(error=f"Error creating event: {str(e)}", status_code=500)

def register_for_event(event_id):
    try:
        from flask_jwt_extended import get_jwt_identity
        current_user_id = get_jwt_identity()
        
        if not current_user_id:
            return response_handler(error="User not authenticated", status_code=401)
        
        # Check if already registered
        existing = EventRegistration.find_one({
            'eventId': ObjectId(event_id),
            'userId': ObjectId(current_user_id)
        })
        
        if existing:
            return response_handler(error="Already registered", status_code=400)
        
        # Create registration
        registration_data = {
            'eventId': ObjectId(event_id),
            'userId': ObjectId(current_user_id),
            'status': 'pending'
        }
        
        EventRegistration.create(registration_data)
        
        # Add participant to event
        Event.add_participant(event_id, current_user_id)
        
        # Get total registrations
        total = EventRegistration.count_by_event(event_id)
        
        return response_handler(
            data={
                'eventId': event_id,
                'totalRegistrations': total
            },
            status_code=201,
            message="Registered successfully"
        )
        
    except Exception as e:
        print(f"Error registering for event: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(error=f"Registration failed: {str(e)}", status_code=500)

def leave_event(event_id):
    try:
        from flask_jwt_extended import get_jwt_identity
        current_user_id = get_jwt_identity()
        
        if not current_user_id:
            return response_handler(error="User not authenticated", status_code=401)
        
        # Remove participant from event
        Event.remove_participant(event_id, current_user_id)
        
        # Delete registration
        registration = EventRegistration.find_one({
            'eventId': ObjectId(event_id),
            'userId': ObjectId(current_user_id)
        })
        
        if registration:
            EventRegistration.delete_by_id(registration['_id'])
        
        return response_handler(message="Left event successfully")
        
    except Exception as e:
        print(f"Error in leave_event: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(error=f"Failed to leave event: {str(e)}", status_code=500)

def approve_event(event_id):
    try:
        result = Event.update_by_id(event_id, {'approved': True})
        if result.modified_count == 0:
            return response_handler(error="Event not found", status_code=404)
        
        return response_handler(message="Event approved successfully")
        
    except Exception as e:
        print(f"Error in approve_event: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(error=f"Approval failed: {str(e)}", status_code=500)

def get_coach_registrations():
    try:
        from flask_jwt_extended import get_jwt_identity
        current_user_id = get_jwt_identity()
        
        if not current_user_id:
            return response_handler(error="User not authenticated", status_code=401)
        
        coach_id = ObjectId(current_user_id)
        
        # Find events created by this coach
        events = Event.find({'createdBy': coach_id})
        event_ids = [e['_id'] for e in events]
        
        # Find registrations for these events
        registrations = []
        if event_ids:
            registrations = EventRegistration.find({'eventId': {'$in': event_ids}})
        
        # Format response
        result = []
        for event in events:
            event_regs = [r for r in registrations if r.get('eventId') == event['_id']]
            
            # Convert event ObjectId to string
            event['_id'] = str(event['_id'])
            
            # Format registrations
            formatted_regs = []
            for reg in event_regs:
                user = User.find_by_id(reg['userId'])
                reg['_id'] = str(reg['_id'])
                reg['userId'] = str(reg['userId'])
                reg['eventId'] = str(reg['eventId'])
                
                # Add user details
                if user:
                    if 'password' in user:
                        del user['password']
                    user = convert_objectid_to_str(user)
                    reg['userDetails'] = user
                
                formatted_regs.append(reg)
            
            result.append({
                'eventId': event['_id'],
                'title': event.get('title'),
                'description': event.get('description'),
                'location': event.get('location'),
                'startDate': event.get('startDate').isoformat() if event.get('startDate') else None,
                'endDate': event.get('endDate').isoformat() if event.get('endDate') else None,
                'registrations': formatted_regs
            })
        
        return response_handler(
            data={'events': result},
            message="Coach events and registrations fetched"
        )
        
    except Exception as e:
        print(f"Error fetching coach registrations: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(error=f"Server error: {str(e)}", status_code=500)

def update_registration_status(registration_id):
    try:
        data = request.get_json()
        status = data.get('status')
        
        if status not in ['accepted', 'rejected', 'pending']:
            return response_handler(error="Invalid status", status_code=400)
        
        EventRegistration.update_by_id(registration_id, {'status': status})
        
        return response_handler(message="Status updated successfully")
        
    except Exception as e:
        print(f"Error in update_registration_status: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(error=f"Server error: {str(e)}", status_code=500)