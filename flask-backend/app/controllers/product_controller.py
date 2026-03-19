# from flask import request
# from flask_jwt_extended import get_jwt_identity, jwt_required
# from bson import ObjectId
# from datetime import datetime

# from app.models.product import Product
# from app.models.user import User
# from app.response_handler import response_handler

# # Public routes (no auth required)
# def get_all_products():
#     """Get all products with optional filtering"""
#     try:
#         # Get query parameters
#         category = request.args.get('category')
#         search = request.args.get('search')
#         min_price = request.args.get('min_price', type=float)
#         max_price = request.args.get('max_price', type=float)
#         sort = request.args.get('sort', 'created_at')
#         order = request.args.get('order', 'desc')
#         limit = int(request.args.get('limit', 50))
#         skip = int(request.args.get('skip', 0))
        
#         # Build query
#         query = {}
#         if category:
#             query['category'] = category
#         if search:
#             query['$or'] = [
#                 {'name': {'$regex': search, '$options': 'i'}},
#                 {'description': {'$regex': search, '$options': 'i'}}
#             ]
#         if min_price is not None or max_price is not None:
#             query['price'] = {}
#             if min_price is not None:
#                 query['price']['$gte'] = min_price
#             if max_price is not None:
#                 query['price']['$lte'] = max_price
        
#         # Build sort
#         sort_field = sort if order == 'asc' else f'-{sort}'
        
#         products = Product.find(query, sort=sort_field, limit=limit, skip=skip)
        
#         # Format products
#         formatted_products = []
#         for product in products:
#             product['_id'] = str(product['_id'])
#             formatted_products.append(product)
        
#         # Get total count
#         total = len(Product.find(query))
        
#         return response_handler(
#             data={
#                 'products': formatted_products,
#                 'total': total,
#                 'limit': limit,
#                 'skip': skip
#             },
#             message="Products fetched successfully"
#         )
        
#     except Exception as e:
#         print(f"Error fetching products: {e}")
#         import traceback
#         traceback.print_exc()
#         return response_handler(
#             error="Failed to fetch products",
#             status_code=500
#         )

# def get_product(product_id):
#     """Get single product by ID"""
#     try:
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
        
#         product['_id'] = str(product['_id'])
        
#         return response_handler(
#             data=product,
#             message="Product fetched successfully"
#         )
        
#     except Exception as e:
#         print(f"Error fetching product: {e}")
#         return response_handler(
#             error="Failed to fetch product",
#             status_code=500
#         )

# # Admin routes (require admin role)
# @jwt_required()
# def create_product():
#     """Create a new product (Admin only)"""
#     try:
#         # Check if user is admin
#         current_user_id = get_jwt_identity()
#         current_user = User.find_by_id(current_user_id)
        
#         if not current_user or current_user.get('role') != 'admin':
#             return response_handler(
#                 error="Only admins can create products",
#                 status_code=403
#             )
        
#         data = request.get_json()
        
#         # Validate required fields
#         required_fields = ['name', 'description', 'price', 'category']
#         for field in required_fields:
#             if field not in data:
#                 return response_handler(
#                     error=f"{field} is required",
#                     status_code=400
#                 )
        
#         # Validate price
#         try:
#             price = float(data['price'])
#             if price <= 0:
#                 return response_handler(
#                     error="Price must be greater than 0",
#                     status_code=400
#                 )
#         except ValueError:
#             return response_handler(
#                 error="Invalid price format",
#                 status_code=400
#             )
        
#         # Validate stock
#         stock = int(data.get('stock', 0))
#         if stock < 0:
#             return response_handler(
#                 error="Stock cannot be negative",
#                 status_code=400
#             )
        
#         product_data = {
#             'name': data['name'],
#             'description': data['description'],
#             'price': price,
#             'category': data['category'],
#             'stock': stock,
#             'image': data.get('image', ''),
#             'created_by': ObjectId(current_user_id),
#             'created_at': datetime.utcnow()
#         }
        
#         product_id = Product.create(product_data)
#         product_data['_id'] = str(product_id)
        
#         return response_handler(
#             data=product_data,
#             message="Product created successfully",
#             status_code=201
#         )
        
#     except Exception as e:
#         print(f"Error creating product: {e}")
#         import traceback
#         traceback.print_exc()
#         return response_handler(
#             error="Failed to create product",
#             status_code=500
#         )

# @jwt_required()
# def update_product(product_id):
#     """Update a product (Admin only)"""
#     try:
#         # Check if user is admin
#         current_user_id = get_jwt_identity()
#         current_user = User.find_by_id(current_user_id)
        
#         if not current_user or current_user.get('role') != 'admin':
#             return response_handler(
#                 error="Only admins can update products",
#                 status_code=403
#             )
        
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
        
#         data = request.get_json()
#         update_data = {}
        
#         # Update allowed fields
#         allowed_fields = ['name', 'description', 'category', 'image']
#         for field in allowed_fields:
#             if field in data:
#                 update_data[field] = data[field]
        
#         # Handle price separately
#         if 'price' in data:
#             try:
#                 price = float(data['price'])
#                 if price <= 0:
#                     return response_handler(
#                         error="Price must be greater than 0",
#                         status_code=400
#                     )
#                 update_data['price'] = price
#             except ValueError:
#                 return response_handler(
#                     error="Invalid price format",
#                     status_code=400
#                 )
        
#         # Handle stock separately
#         if 'stock' in data:
#             stock = int(data['stock'])
#             if stock < 0:
#                 return response_handler(
#                     error="Stock cannot be negative",
#                     status_code=400
#                 )
#             update_data['stock'] = stock
        
#         if not update_data:
#             return response_handler(
#                 error="No valid fields to update",
#                 status_code=400
#             )
        
#         update_data['updated_at'] = datetime.utcnow()
        
#         result = Product.update_by_id(product_id, update_data)
        
#         if result.modified_count == 0:
#             return response_handler(
#                 message="No changes made"
#             )
        
#         # Get updated product
#         updated_product = Product.find_by_id(product_id)
#         updated_product['_id'] = str(updated_product['_id'])
        
#         return response_handler(
#             data=updated_product,
#             message="Product updated successfully"
#         )
        
#     except Exception as e:
#         print(f"Error updating product: {e}")
#         return response_handler(
#             error="Failed to update product",
#             status_code=500
#         )

# @jwt_required()
# def delete_product(product_id):
#     """Delete a product (Admin only)"""
#     try:
#         # Check if user is admin
#         current_user_id = get_jwt_identity()
#         current_user = User.find_by_id(current_user_id)
        
#         if not current_user or current_user.get('role') != 'admin':
#             return response_handler(
#                 error="Only admins can delete products",
#                 status_code=403
#             )
        
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
        
#         result = Product.delete_by_id(product_id)
        
#         if result.deleted_count == 0:
#             return response_handler(
#                 error="Failed to delete product",
#                 status_code=500
#             )
        
#         return response_handler(
#             message="Product deleted successfully"
#         )
        
#     except Exception as e:
#         print(f"Error deleting product: {e}")
#         return response_handler(
#             error="Failed to delete product",
#             status_code=500
#         )

# def get_categories():
#     """Get all product categories"""
#     try:
#         products = Product.find()
#         categories = set()
#         for product in products:
#             if 'category' in product and product['category']:
#                 categories.add(product['category'])
        
#         return response_handler(
#             data={'categories': sorted(list(categories))},
#             message="Categories fetched successfully"
#         )
        
#     except Exception as e:
#         print(f"Error fetching categories: {e}")
#         return response_handler(
#             error="Failed to fetch categories",
#             status_code=500
#         )



from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
from datetime import datetime

from app.models.product import Product
from app.models.user import User
from app.response_handler import response_handler

# Public routes (no auth required)
def get_all_products():
    """Get all products with optional filtering"""
    try:
        # Get query parameters
        category = request.args.get('category')
        search = request.args.get('search')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        sort = request.args.get('sort', 'created_at')
        order = request.args.get('order', 'desc')
        limit = int(request.args.get('limit', 50))
        skip = int(request.args.get('skip', 0))
        
        # Build query
        query = {}
        if category:
            query['category'] = category
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'description': {'$regex': search, '$options': 'i'}}
            ]
        if min_price is not None or max_price is not None:
            query['price'] = {}
            if min_price is not None:
                query['price']['$gte'] = min_price
            if max_price is not None:
                query['price']['$lte'] = max_price
        
        # Build sort
        sort_field = sort if order == 'asc' else f'-{sort}'
        
        products = Product.find(query, sort=sort_field, limit=limit, skip=skip)
        
        # Format products - CONVERT ALL OBJECTIDS TO STRINGS
        formatted_products = []
        for product in products:
            # Convert _id to string
            product['_id'] = str(product['_id'])
            
            # Convert created_by if it exists
            if 'created_by' in product and product['created_by']:
                product['created_by'] = str(product['created_by'])
                
            formatted_products.append(product)
        
        # Get total count
        total = len(Product.find(query))
        
        return response_handler(
            data={
                'products': formatted_products,
                'total': total,
                'limit': limit,
                'skip': skip
            },
            message="Products fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching products: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to fetch products",
            status_code=500
        )

def get_product(product_id):
    """Get single product by ID"""
    try:
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
        
        # Convert ObjectId to string
        product['_id'] = str(product['_id'])
        if 'created_by' in product and product['created_by']:
            product['created_by'] = str(product['created_by'])
        
        return response_handler(
            data=product,
            message="Product fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching product: {e}")
        return response_handler(
            error="Failed to fetch product",
            status_code=500
        )

# Admin routes (require admin role)
@jwt_required()
def create_product():
    """Create a new product (Admin only)"""
    try:
        # Check if user is admin
        current_user_id = get_jwt_identity()
        current_user = User.find_by_id(current_user_id)
        
        if not current_user or current_user.get('role') != 'admin':
            return response_handler(
                error="Only admins can create products",
                status_code=403
            )
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'description', 'price', 'category']
        for field in required_fields:
            if field not in data:
                return response_handler(
                    error=f"{field} is required",
                    status_code=400
                )
        
        # Validate price
        try:
            price = float(data['price'])
            if price <= 0:
                return response_handler(
                    error="Price must be greater than 0",
                    status_code=400
                )
        except ValueError:
            return response_handler(
                error="Invalid price format",
                status_code=400
            )
        
        # Validate stock
        stock = int(data.get('stock', 0))
        if stock < 0:
            return response_handler(
                error="Stock cannot be negative",
                status_code=400
            )
        
        product_data = {
            'name': data['name'],
            'description': data['description'],
            'price': price,
            'category': data['category'],
            'stock': stock,
            'image': data.get('image', ''),
            'created_by': ObjectId(current_user_id),
            'created_at': datetime.utcnow()
        }
        
        product_id = Product.create(product_data)
        product_data['_id'] = str(product_id)
        product_data['created_by'] = str(current_user_id)
        
        return response_handler(
            data=product_data,
            message="Product created successfully",
            status_code=201
        )
        
    except Exception as e:
        print(f"Error creating product: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to create product",
            status_code=500
        )

@jwt_required()
def update_product(product_id):
    """Update a product (Admin only)"""
    try:
        # Check if user is admin
        current_user_id = get_jwt_identity()
        current_user = User.find_by_id(current_user_id)
        
        if not current_user or current_user.get('role') != 'admin':
            return response_handler(
                error="Only admins can update products",
                status_code=403
            )
        
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
        
        data = request.get_json()
        update_data = {}
        
        # Update allowed fields
        allowed_fields = ['name', 'description', 'category', 'image']
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        # Handle price separately
        if 'price' in data:
            try:
                price = float(data['price'])
                if price <= 0:
                    return response_handler(
                        error="Price must be greater than 0",
                        status_code=400
                    )
                update_data['price'] = price
            except ValueError:
                return response_handler(
                    error="Invalid price format",
                    status_code=400
                )
        
        # Handle stock separately
        if 'stock' in data:
            stock = int(data['stock'])
            if stock < 0:
                return response_handler(
                    error="Stock cannot be negative",
                    status_code=400
                )
            update_data['stock'] = stock
        
        if not update_data:
            return response_handler(
                error="No valid fields to update",
                status_code=400
            )
        
        update_data['updated_at'] = datetime.utcnow()
        
        result = Product.update_by_id(product_id, update_data)
        
        if result.modified_count == 0:
            return response_handler(
                message="No changes made"
            )
        
        # Get updated product
        updated_product = Product.find_by_id(product_id)
        updated_product['_id'] = str(updated_product['_id'])
        if 'created_by' in updated_product and updated_product['created_by']:
            updated_product['created_by'] = str(updated_product['created_by'])
        
        return response_handler(
            data=updated_product,
            message="Product updated successfully"
        )
        
    except Exception as e:
        print(f"Error updating product: {e}")
        return response_handler(
            error="Failed to update product",
            status_code=500
        )

@jwt_required()
def delete_product(product_id):
    """Delete a product (Admin only)"""
    try:
        # Check if user is admin
        current_user_id = get_jwt_identity()
        current_user = User.find_by_id(current_user_id)
        
        if not current_user or current_user.get('role') != 'admin':
            return response_handler(
                error="Only admins can delete products",
                status_code=403
            )
        
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
        
        result = Product.delete_by_id(product_id)
        
        if result.deleted_count == 0:
            return response_handler(
                error="Failed to delete product",
                status_code=500
            )
        
        return response_handler(
            message="Product deleted successfully"
        )
        
    except Exception as e:
        print(f"Error deleting product: {e}")
        return response_handler(
            error="Failed to delete product",
            status_code=500
        )

def get_categories():
    """Get all product categories"""
    try:
        products = Product.find()
        categories = set()
        for product in products:
            if 'category' in product and product['category']:
                # Make sure product is properly formatted before accessing
                if isinstance(product, dict):
                    categories.add(product['category'])
        
        return response_handler(
            data={'categories': sorted(list(categories))},
            message="Categories fetched successfully"
        )
        
    except Exception as e:
        print(f"Error fetching categories: {e}")
        import traceback
        traceback.print_exc()
        return response_handler(
            error="Failed to fetch categories",
            status_code=500
        )