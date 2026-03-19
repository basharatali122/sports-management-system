from flask import Blueprint
from app.controllers import order_controller

order_bp = Blueprint('orders', __name__)

# User routes
order_bp.route('/', methods=['POST'])(order_controller.create_order)
order_bp.route('/my', methods=['GET'])(order_controller.get_user_orders)
order_bp.route('/<order_id>', methods=['GET'])(order_controller.get_order)

# Admin routes
order_bp.route('/admin/all', methods=['GET'])(order_controller.get_all_orders)
order_bp.route('/<order_id>/status', methods=['PUT'])(order_controller.update_order_status)