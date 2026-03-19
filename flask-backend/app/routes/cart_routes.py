from flask import Blueprint
from app.controllers import cart_controller

cart_bp = Blueprint('cart', __name__)

# Cart routes (all require authentication)
cart_bp.route('/', methods=['GET'])(cart_controller.get_cart)
cart_bp.route('/add', methods=['POST'])(cart_controller.add_to_cart)
cart_bp.route('/update', methods=['PUT'])(cart_controller.update_cart_item)
cart_bp.route('/remove', methods=['DELETE'])(cart_controller.remove_from_cart)
cart_bp.route('/clear', methods=['POST'])(cart_controller.clear_cart)