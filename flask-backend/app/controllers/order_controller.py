from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
from datetime import datetime

from app.models.order import Order
from app.models.cart import Cart
from app.models.product import Product
from app.models.user import User
from app.response_handler import response_handler
from app import socketio

@jwt_required()
def create_order():
    """Create a new order from cart (checkout)"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate shipping details
        shipping = data.get('shipping_details', {})
        required_shipping = ['full_name', 'address', 'city', 'phone']
        for field in required_shipping:
            if field not in shipping or not shipping[field]:
                return response_handler(
                    error=f"Shipping {field} is required",
                    status_code=400
                )
        
        # Get user's cart
        cart = Cart.find_by_user(current_user_id)
        if not cart or not cart.get('items'):
            return response_handler(
                error="Cart is empty",
                status_code=400
            )
        
        # Process cart items and validate stock
        order_items = []
        total_amount = 0
        
        for item in cart['items']:
            product = Product.find_by_id(item['product_id'])
            if not product:
                return response_handler(
                    error=f"Product not found",
                    status_code=400
                )
            
            # Check stock
            if product['stock'] < item['quantity']:
                return response_handler(
                    error=f"Insufficient stock for {product['name']}. Available: {product['stock']}",
                    status_code=400
                )
            
            order_items.append({
                'product_id': ObjectId(item['product_id']),
                'product_name': product['name'],
                'quantity': item['quantity'],
                'price': product['price'],
                'total': product['price'] * item['quantity']
            })
            
            total_amount += product['price'] * item['quantity']
        
        # Create order
        order_data = {
            'user_id': ObjectId(current_user_id),
            'items': order_items,
            'total_amount': total_amount,
            'shipping_details': shipping,
            'payment_status': 'pending',
            'order_status': 'pending',
            'payment_method': data.get('payment_method', 'cod'),  # cash on delivery
            'created_at': datetime.utcnow()
        }
        
        order_id = Order.create(order_data)
        
        # Update stock (reduce quantity)
        for item in cart['items']:
            Product.update_stock(item['product_id'], -item['quantity'])
        
        # Clear cart
        Cart.clear_cart(current_user_id)
        
        # Get user info for notification
        user = User.find_by_id(current_user_id)
        
        # Emit notification to admin about new order
        socketio.emit('admin_notification', {
            'type': 'new_order',
            'order_id': str(order_id),
            'total_amount': total_amount,
            'user_name': user.get('name', 'Unknown')
        })
        
        # Format response
        order_data['_id'] = str(order_id)
        order_data['user_id'] = str(order_data['user_id'])
        for item in order_data['items']:
            item['product_id'] = str(item['product_id'])
        
        return response_handler(
            data=order_data,
            message="Order created successfully",
            status_code=201
        )
        
    except Exception as e:
        print(f"Error creating order: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to create order",
            status_code=500
        )

@jwt_required()
def get_user_orders():
    """Get current user's orders"""
    try:
        current_user_id = get_jwt_identity()
        limit = int(request.args.get('limit', 50))
        skip = int(request.args.get('skip', 0))
        
        orders = Order.find_by_user(current_user_id, limit=limit, skip=skip)
        
        formatted_orders = []
        for order in orders:
            order['_id'] = str(order['_id'])
            order['user_id'] = str(order['user_id'])
            for item in order['items']:
                item['product_id'] = str(item['product_id'])
            formatted_orders.append(order)
        
        return response_handler(
            data={'orders': formatted_orders},
            message="Orders fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching user orders: {e}")
        return response_handler(
            error="Failed to fetch orders",
            status_code=500
        )

@jwt_required()
def get_order(order_id):
    """Get single order details"""
    try:
        current_user_id = get_jwt_identity()
        
        if not ObjectId.is_valid(order_id):
            return response_handler(
                error="Invalid order ID",
                status_code=400
            )
        
        order = Order.find_by_id(order_id)
        if not order:
            return response_handler(
                error="Order not found",
                status_code=404
            )
        
        # Check if user owns the order or is admin
        current_user = User.find_by_id(current_user_id)
        is_admin = current_user and current_user.get('role') == 'admin'
        
        if str(order['user_id']) != current_user_id and not is_admin:
            return response_handler(
                error="Access denied",
                status_code=403
            )
        
        order['_id'] = str(order['_id'])
        order['user_id'] = str(order['user_id'])
        for item in order['items']:
            item['product_id'] = str(item['product_id'])
        
        return response_handler(
            data=order,
            message="Order fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching order: {e}")
        return response_handler(
            error="Failed to fetch order",
            status_code=500
        )

# Admin routes
@jwt_required()
def get_all_orders():
    """Get all orders (Admin only)"""
    try:
        # Check if user is admin
        current_user_id = get_jwt_identity()
        current_user = User.find_by_id(current_user_id)
        
        if not current_user or current_user.get('role') != 'admin':
            return response_handler(
                error="Only admins can view all orders",
                status_code=403
            )
        
        # Get query parameters
        status = request.args.get('status')
        payment_status = request.args.get('payment_status')
        limit = int(request.args.get('limit', 50))
        skip = int(request.args.get('skip', 0))
        
        # Build query
        query = {}
        if status:
            query['order_status'] = status
        if payment_status:
            query['payment_status'] = payment_status
        
        orders = Order.find(query, sort='-created_at', limit=limit, skip=skip)
        
        formatted_orders = []
        for order in orders:
            order['_id'] = str(order['_id'])
            order['user_id'] = str(order['user_id'])
            
            # Get user details
            user = User.find_by_id(order['user_id'])
            if user:
                order['user'] = {
                    'name': user.get('name'),
                    'email': user.get('email'),
                    'role': user.get('role')
                }
            
            for item in order['items']:
                item['product_id'] = str(item['product_id'])
            formatted_orders.append(order)
        
        # Get stats
        stats = Order.get_order_stats()
        
        return response_handler(
            data={
                'orders': formatted_orders,
                'stats': stats
            },
            message="Orders fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching all orders: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to fetch orders",
            status_code=500
        )

@jwt_required()
def update_order_status(order_id):
    """Update order status (Admin only)"""
    try:
        # Check if user is admin
        current_user_id = get_jwt_identity()
        current_user = User.find_by_id(current_user_id)
        
        if not current_user or current_user.get('role') != 'admin':
            return response_handler(
                error="Only admins can update order status",
                status_code=403
            )
        
        if not ObjectId.is_valid(order_id):
            return response_handler(
                error="Invalid order ID",
                status_code=400
            )
        
        order = Order.find_by_id(order_id)
        if not order:
            return response_handler(
                error="Order not found",
                status_code=404
            )
        
        data = request.get_json()
        order_status = data.get('order_status')
        payment_status = data.get('payment_status')
        
        if not order_status and not payment_status:
            return response_handler(
                error="No status to update",
                status_code=400
            )
        
        # Validate order status
        valid_order_status = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled']
        if order_status and order_status not in valid_order_status:
            return response_handler(
                error=f"Invalid order status. Must be one of: {', '.join(valid_order_status)}",
                status_code=400
            )
        
        # Validate payment status
        valid_payment_status = ['pending', 'paid', 'failed', 'refunded']
        if payment_status and payment_status not in valid_payment_status:
            return response_handler(
                error=f"Invalid payment status. Must be one of: {', '.join(valid_payment_status)}",
                status_code=400
            )
        
        update_data = {}
        if order_status:
            update_data['order_status'] = order_status
        if payment_status:
            update_data['payment_status'] = payment_status
        
        result = Order.update_by_id(order_id, update_data)
        
        if result.modified_count == 0:
            return response_handler(
                message="No changes made"
            )
        
        # Emit notification to user about order status update
        socketio.emit(f'order_update_{order["user_id"]}', {
            'type': 'order_status_update',
            'order_id': order_id,
            'order_status': order_status,
            'payment_status': payment_status
        })
        
        return response_handler(
            message="Order status updated successfully"
        )
        
    except Exception as e:
        print(f"Error updating order status: {e}")
        return response_handler(
            error="Failed to update order status",
            status_code=500
        )