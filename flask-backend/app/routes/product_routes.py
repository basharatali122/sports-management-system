# from flask import Blueprint
# from app.controllers import product_controller

# product_bp = Blueprint('products', __name__)

# # Public routes
# product_bp.route('/', methods=['GET'])(product_controller.get_all_products)
# product_bp.route('/<product_id>', methods=['GET'])(product_controller.get_product)
# product_bp.route('/categories', methods=['GET'])(product_controller.get_categories)

# # Admin routes
# product_bp.route('/', methods=['POST'])(product_controller.create_product)
# product_bp.route('/<product_id>', methods=['PUT'])(product_controller.update_product)
# product_bp.route('/<product_id>', methods=['DELETE'])(product_controller.delete_product)



from flask import Blueprint
from app.controllers import product_controller

product_bp = Blueprint('products', __name__)

# Public routes - remove trailing slashes
product_bp.route('/', methods=['GET'])(product_controller.get_all_products)  # Changed from '/' to ''

product_bp.route('', methods=['GET'])(product_controller.get_all_products)  # Changed from '/' to ''
product_bp.route('/<product_id>', methods=['GET'])(product_controller.get_product)
product_bp.route('/categories', methods=['GET'])(product_controller.get_categories)

# Admin routes
product_bp.route('', methods=['POST'])(product_controller.create_product)  # Changed from '/' to ''
product_bp.route('/<product_id>', methods=['PUT'])(product_controller.update_product)
product_bp.route('/<product_id>', methods=['DELETE'])(product_controller.delete_product)