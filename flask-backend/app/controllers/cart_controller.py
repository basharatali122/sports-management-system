# from flask import request
# from flask_jwt_extended import get_jwt_identity, jwt_required
# from bson import ObjectId
# from datetime import datetime

# from app.models.cart import Cart
# from app.models.product import Product
# from app.models.user import User
# from app.response_handler import response_handler

# @jwt_required()
# def get_cart():
#     """Get current user's cart"""
#     try:
#         current_user_id = get_jwt_identity()
        
#         cart = Cart.find_by_user(current_user_id)
        
#         if not cart:
#             # Return empty cart
#             return response_handler(
#                 data={
#                     'items': [],
#                     'total': 0
#                 },
#                 message="Cart is empty"
#             )
        
#         # Format cart items with product details
#         formatted_items = []
#         total = 0
        
#         for item in cart.get('items', []):
#             product = Product.find_by_id(item['product_id'])
#             if product:
#                 product['_id'] = str(product['_id'])
#                 item_total = product['price'] * item['quantity']
#                 total += item_total
                
#                 formatted_items.append({
#                     'product': product,
#                     'quantity': item['quantity'],
#                     'added_at': item.get('added_at', datetime.utcnow()).isoformat(),
#                     'item_total': item_total
#                 })
        
#         return response_handler(
#             data={
#                 'items': formatted_items,
#                 'total': total,
#                 'item_count': len(formatted_items)
#             },
#             message="Cart fetched successfully"
#         )
        
#     except Exception as e:
#         print(f"Error fetching cart: {e}")
#         import traceback
#         traceback.print_exc()
#         return response_handler(
#             error="Failed to fetch cart",
#             status_code=500
#         )

# @jwt_required()
# def add_to_cart():
#     """Add item to cart"""
#     try:
#         current_user_id = get_jwt_identity()
#         data = request.get_json()
        
#         product_id = data.get('productId')
#         quantity = int(data.get('quantity', 1))
        
#         if not product_id:
#             return response_handler(
#                 error="Product ID is required",
#                 status_code=400
#             )
        
#         if quantity < 1:
#             return response_handler(
#                 error="Quantity must be at least 1",
#                 status_code=400
#             )
        
#         # Validate product exists
#         if not ObjectId.is_valid(product_id):
#             return response_handler(
#                 error="Invalid product ID",
#                 status_code=400
#             )
        
#         product = Product.find_by_id(product_id)
#         if not product:
#             return response_handler(
#                 error="Product not found",
#                 status_code=404
#             )
        
#         # Check stock
#         if product['stock'] < quantity:
#             return response_handler(
#                 error=f"Only {product['stock']} items available in stock",
#                 status_code=400
#             )
        
#         # Add to cart
#         cart = Cart.add_item(current_user_id, product_id, quantity)
        
#         return response_handler(
#             message="Item added to cart successfully",
#             status_code=201
#         )
        
#     except Exception as e:
#         print(f"Error adding to cart: {e}")
#         import traceback
#         traceback.print_exc()
#         return response_handler(
#             error="Failed to add item to cart",
#             status_code=500
#         )

# @jwt_required()
# def update_cart_item():
#     """Update item quantity in cart"""
#     try:
#         current_user_id = get_jwt_identity()
#         data = request.get_json()
        
#         product_id = data.get('productId')
#         quantity = int(data.get('quantity', 1))
        
#         if not product_id:
#             return response_handler(
#                 error="Product ID is required",
#                 status_code=400
#             )
        
#         if quantity < 0:
#             return response_handler(
#                 error="Quantity cannot be negative",
#                 status_code=400
#             )
        
#         if quantity == 0:
#             # Remove item
#             result = Cart.remove_item(current_user_id, product_id)
#             message = "Item removed from cart"
#         else:
#             # Update quantity
#             # Check stock
#             product = Product.find_by_id(product_id)
#             if not product:
#                 return response_handler(
#                     error="Product not found",
#                     status_code=404
#                 )
            
#             if product['stock'] < quantity:
#                 return response_handler(
#                     error=f"Only {product['stock']} items available in stock",
#                     status_code=400
#                 )
            
#             result = Cart.update_item_quantity(current_user_id, product_id, quantity)
#             message = "Cart updated successfully"
        
#         if not result:
#             return response_handler(
#                 error="Failed to update cart",
#                 status_code=400
#             )
        
#         return response_handler(
#             message=message
#         )
        
#     except Exception as e:
#         print(f"Error updating cart: {e}")
#         return response_handler(
#             error="Failed to update cart",
#             status_code=500
#         )

# @jwt_required()
# def remove_from_cart():
#     """Remove item from cart"""
#     try:
#         current_user_id = get_jwt_identity()
#         data = request.get_json()
        
#         product_id = data.get('productId')
        
#         if not product_id:
#             return response_handler(
#                 error="Product ID is required",
#                 status_code=400
#             )
        
#         result = Cart.remove_item(current_user_id, product_id)
        
#         if not result:
#             return response_handler(
#                 error="Item not found in cart",
#                 status_code=404
#             )
        
#         return response_handler(
#             message="Item removed from cart"
#         )
        
#     except Exception as e:
#         print(f"Error removing from cart: {e}")
#         return response_handler(
#             error="Failed to remove item",
#             status_code=500
#         )

# @jwt_required()
# def clear_cart():
#     """Clear entire cart"""
#     try:
#         current_user_id = get_jwt_identity()
        
#         Cart.clear_cart(current_user_id)
        
#         return response_handler(
#             message="Cart cleared successfully"
#         )
        
#     except Exception as e:
#         print(f"Error clearing cart: {e}")
#         return response_handler(
#             error="Failed to clear cart",
#             status_code=500
#         )




from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
from datetime import datetime

from app.models.cart import Cart
from app.models.product import Product
from app.models.user import User
from app.response_handler import response_handler

@jwt_required()
def get_cart():
    """Get current user's cart"""
    try:
        current_user_id = get_jwt_identity()
        
        cart = Cart.find_by_user(current_user_id)
        
        if not cart:
            # Return empty cart
            return response_handler(
                data={
                    'items': [],
                    'total': 0,
                    'item_count': 0
                },
                message="Cart is empty"
            )
        
        # Format cart items with product details
        formatted_items = []
        total = 0
        
        for item in cart.get('items', []):
            product = Product.find_by_id(item['product_id'])
            if product:
                # Convert ObjectId to string for product
                product['_id'] = str(product['_id'])
                if 'created_by' in product and product['created_by']:
                    product['created_by'] = str(product['created_by'])
                
                item_total = product['price'] * item['quantity']
                total += item_total
                
                formatted_items.append({
                    'product': product,
                    'quantity': item['quantity'],
                    'added_at': item.get('added_at', datetime.utcnow()).isoformat(),
                    'item_total': item_total
                })
        
        return response_handler(
            data={
                'items': formatted_items,
                'total': total,
                'item_count': len(formatted_items)
            },
            message="Cart fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching cart: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to fetch cart",
            status_code=500
        )

@jwt_required()
def add_to_cart():
    """Add item to cart"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        product_id = data.get('productId')
        quantity = int(data.get('quantity', 1))
        
        if not product_id:
            return response_handler(
                error="Product ID is required",
                status_code=400
            )
        
        if quantity < 1:
            return response_handler(
                error="Quantity must be at least 1",
                status_code=400
            )
        
        # Validate product exists
        if not ObjectId.is_valid(product_id):
            return response_handler(
                error="Invalid product ID",
                status_code=400
            )
        
        product = Product.find_by_id(product_id)
        if not product:
            return response_handler(
                error="Product not found",
                status_code=404
            )
        
        # Check stock
        if product['stock'] < quantity:
            return response_handler(
                error=f"Only {product['stock']} items available in stock",
                status_code=400
            )
        
        # Add to cart
        cart = Cart.add_item(current_user_id, product_id, quantity)
        
        return response_handler(
            message="Item added to cart successfully",
            status_code=201
        )
        
    except Exception as e:
        print(f"Error adding to cart: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to add item to cart",
            status_code=500
        )

@jwt_required()
def update_cart_item():
    """Update item quantity in cart"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        product_id = data.get('productId')
        quantity = int(data.get('quantity', 1))
        
        if not product_id:
            return response_handler(
                error="Product ID is required",
                status_code=400
            )
        
        if quantity < 0:
            return response_handler(
                error="Quantity cannot be negative",
                status_code=400
            )
        
        if quantity == 0:
            # Remove item
            result = Cart.remove_item(current_user_id, product_id)
            message = "Item removed from cart"
        else:
            # Update quantity
            # Check stock
            product = Product.find_by_id(product_id)
            if not product:
                return response_handler(
                    error="Product not found",
                    status_code=404
                )
            
            if product['stock'] < quantity:
                return response_handler(
                    error=f"Only {product['stock']} items available in stock",
                    status_code=400
                )
            
            result = Cart.update_item_quantity(current_user_id, product_id, quantity)
            message = "Cart updated successfully"
        
        if not result:
            return response_handler(
                error="Failed to update cart",
                status_code=400
            )
        
        return response_handler(
            message=message
        )
        
    except Exception as e:
        print(f"Error updating cart: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to update cart",
            status_code=500
        )

@jwt_required()
def remove_from_cart():
    """Remove item from cart"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        product_id = data.get('productId')
        
        if not product_id:
            return response_handler(
                error="Product ID is required",
                status_code=400
            )
        
        result = Cart.remove_item(current_user_id, product_id)
        
        if not result:
            return response_handler(
                error="Item not found in cart",
                status_code=404
            )
        
        return response_handler(
            message="Item removed from cart"
        )
        
    except Exception as e:
        print(f"Error removing from cart: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to remove item",
            status_code=500
        )

@jwt_required()
def clear_cart():
    """Clear entire cart"""
    try:
        current_user_id = get_jwt_identity()
        
        Cart.clear_cart(current_user_id)
        
        return response_handler(
            message="Cart cleared successfully"
        )
        
    except Exception as e:
        print(f"Error clearing cart: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to clear cart",
            status_code=500
        )