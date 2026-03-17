from flask import Blueprint
from app.controllers import chat_controller, notification_controller

chat_bp = Blueprint('chat', __name__)

# Chat routes
chat_bp.route('/send', methods=['POST'])(chat_controller.send_message)
chat_bp.route('/history', methods=['GET'])(chat_controller.get_chat_history)
chat_bp.route('/read', methods=['POST'])(chat_controller.mark_messages_read)
chat_bp.route('/conversations', methods=['GET'])(chat_controller.get_conversations)
chat_bp.route('/unread', methods=['GET'])(chat_controller.get_unread_count)

# Notification routes
chat_bp.route('/notifications', methods=['GET'])(notification_controller.get_notifications)
chat_bp.route('/notifications/<notification_id>/read', methods=['POST'])(notification_controller.mark_notification_read)
chat_bp.route('/notifications/read-all', methods=['POST'])(notification_controller.mark_all_notifications_read)
chat_bp.route('/notifications/<notification_id>', methods=['DELETE'])(notification_controller.delete_notification)

# Admin notification routes
chat_bp.route('/admin/notifications/send', methods=['POST'])(notification_controller.send_admin_notification)