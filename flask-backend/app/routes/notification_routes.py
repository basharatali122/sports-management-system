from flask import Blueprint
from app.controllers import notification_controller

notification_bp = Blueprint('notifications', __name__)

# Notification routes
notification_bp.route('/', methods=['GET'])(notification_controller.get_notifications)
notification_bp.route('/<notification_id>/read', methods=['POST'])(notification_controller.mark_notification_read)
notification_bp.route('/read-all', methods=['POST'])(notification_controller.mark_all_notifications_read)
notification_bp.route('/<notification_id>', methods=['DELETE'])(notification_controller.delete_notification)

# Admin notification route
notification_bp.route('/admin/send', methods=['POST'])(notification_controller.send_admin_notification)