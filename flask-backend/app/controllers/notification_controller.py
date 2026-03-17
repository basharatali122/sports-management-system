from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
from datetime import datetime

from app.models.notification import Notification
from app.models.user import User
from app.response_handler import response_handler
from app import socketio

@jwt_required()
def get_notifications():
    """Get notifications for current user"""
    try:
        current_user_id = get_jwt_identity()
        limit = int(request.args.get('limit', 50))
        skip = int(request.args.get('skip', 0))
        unread_only = request.args.get('unreadOnly', '').lower() == 'true'
        
        notifications = Notification.find_by_user(
            current_user_id,
            limit=limit,
            skip=skip,
            unread_only=unread_only
        )
        
        # Format notifications
        formatted_notifications = []
        for notif in notifications:
            notif['_id'] = str(notif['_id'])
            notif['userId'] = str(notif['userId'])
            notif['created_at'] = notif['created_at'].isoformat()
            formatted_notifications.append(notif)
        
        # Get total unread count
        unread_count = len(Notification.find_by_user(
            current_user_id,
            unread_only=True
        ))
        
        return response_handler(
            data={
                'notifications': formatted_notifications,
                'unreadCount': unread_count,
                'hasMore': len(formatted_notifications) == limit
            },
            message="Notifications fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to fetch notifications",
            status_code=500
        )

@jwt_required()
def mark_notification_read(notification_id):
    """Mark a specific notification as read"""
    try:
        current_user_id = get_jwt_identity()
        
        success = Notification.mark_as_read(notification_id, current_user_id)
        
        if not success:
            return response_handler(
                error="Notification not found",
                status_code=404
            )
        
        # Emit update
        socketio.emit(f'notifications_{current_user_id}', {
            'type': 'notification_read',
            'notificationId': notification_id
        })
        
        return response_handler(
            message="Notification marked as read"
        )
        
    except Exception as e:
        print(f"Error marking notification as read: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to mark notification as read",
            status_code=500
        )

@jwt_required()
def mark_all_notifications_read():
    """Mark all notifications as read for current user"""
    try:
        current_user_id = get_jwt_identity()
        
        count = Notification.mark_all_as_read(current_user_id)
        
        # Emit update
        socketio.emit(f'notifications_{current_user_id}', {
            'type': 'all_read'
        })
        
        return response_handler(
            data={'markedCount': count},
            message="All notifications marked as read"
        )
        
    except Exception as e:
        print(f"Error marking all notifications as read: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to mark notifications as read",
            status_code=500
        )

@jwt_required()
def delete_notification(notification_id):
    """Delete a notification"""
    try:
        current_user_id = get_jwt_identity()
        
        deleted = Notification.delete_notification(notification_id, current_user_id)
        
        if not deleted:
            return response_handler(
                error="Notification not found",
                status_code=404
            )
        
        # Emit update
        socketio.emit(f'notifications_{current_user_id}', {
            'type': 'notification_deleted',
            'notificationId': notification_id
        })
        
        return response_handler(
            message="Notification deleted successfully"
        )
        
    except Exception as e:
        print(f"Error deleting notification: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to delete notification",
            status_code=500
        )

@jwt_required()
def send_admin_notification():
    """Admin sends notification to users (mass notification)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user is admin
        current_user = User.find_by_id(current_user_id)
        if not current_user or current_user.get('role') != 'admin':
            return response_handler(
                error="Only admins can send mass notifications",
                status_code=403
            )
        
        data = request.get_json()
        title = data.get('title')
        message = data.get('message')
        target_role = data.get('targetRole', 'all')  # 'all', 'participant', 'coach', 'admin'
        specific_users = data.get('userIds', [])  # Optional specific users
        
        if not title or not message:
            return response_handler(
                error="Title and message are required",
                status_code=400
            )
        
        # Determine target users
        target_users = []
        
        if specific_users and len(specific_users) > 0:
            # Send to specific users
            target_users = specific_users
        else:
            # Send based on role
            query = {}
            if target_role and target_role != 'all':
                query['role'] = target_role
            
            users = User.find(query)
            target_users = [str(user['_id']) for user in users]
        
        # Create notifications
        notification_ids = []
        for user_id in target_users:
            notif_id = Notification.create_admin_notification(
                user_id,
                title,
                message,
                notification_type='admin_broadcast'
            )
            notification_ids.append(str(notif_id))
            
            # Emit real-time notification
            socketio.emit(f'notifications_{user_id}', {
                'type': 'new_notification',
                'notification': {
                    '_id': str(notif_id),
                    'title': title,
                    'message': message,
                    'type': 'admin_broadcast',
                    'created_at': datetime.utcnow().isoformat(),
                    'isRead': False
                }
            })
        
        return response_handler(
            data={
                'notificationCount': len(notification_ids),
                'notificationIds': notification_ids
            },
            message=f"Notification sent to {len(notification_ids)} users",
            status_code=201
        )
        
    except Exception as e:
        print(f"Error sending admin notification: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to send notification",
            status_code=500
        )