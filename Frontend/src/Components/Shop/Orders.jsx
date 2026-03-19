// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { fetchUserOrders } from '../../store/orderSlice';
// import { formatDistanceToNow } from 'date-fns';
// import {
//   PackageIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   TruckIcon,
//   XCircleIcon,
// } from '@heroicons/react/24/outline';

// const Orders = () => {
//   const dispatch = useDispatch();
//   const { orders, loading } = useSelector((state) => state.orders);
//   const [expandedOrder, setExpandedOrder] = useState(null);

//   useEffect(() => {
//     dispatch(fetchUserOrders());
//   }, [dispatch]);

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending':
//         return <ClockIcon className="h-5 w-5 text-yellow-500" />;
//       case 'confirmed':
//         return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
//       case 'dispatched':
//         return <TruckIcon className="h-5 w-5 text-blue-500" />;
//       case 'delivered':
//         return <PackageIcon className="h-5 w-5 text-green-600" />;
//       case 'cancelled':
//         return <XCircleIcon className="h-5 w-5 text-red-500" />;
//       default:
//         return <PackageIcon className="h-5 w-5 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'confirmed':
//         return 'bg-green-100 text-green-800';
//       case 'dispatched':
//         return 'bg-blue-100 text-blue-800';
//       case 'delivered':
//         return 'bg-green-100 text-green-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return formatDistanceToNow(new Date(dateString), { addSuffix: true });
//     } catch {
//       return 'Recently';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-16 bg-white rounded-lg shadow">
//           <PackageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
//           <p className="text-gray-600 mb-6">Looks like you haven't placed any orders</p>
//           <Link
//             to="/products"
//             className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
//           >
//             Start Shopping
//           </Link>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white rounded-lg shadow overflow-hidden"
//             >
//               {/* Order Header */}
//               <div
//                 className="p-4 border-b cursor-pointer hover:bg-gray-50"
//                 onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
//               >
//                 <div className="flex flex-wrap items-center justify-between gap-4">
//                   <div className="flex items-center space-x-4">
//                     {getStatusIcon(order.order_status)}
//                     <div>
//                       <p className="font-medium">Order #{order._id.slice(-8)}</p>
//                       <p className="text-sm text-gray-500">
//                         {formatDate(order.created_at)}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-4">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
//                       {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
//                     </span>
//                     <span className="font-bold text-indigo-600">
//                       ₹{order.total_amount.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Details (Expanded) */}
//               {expandedOrder === order._id && (
//                 <div className="p-4 bg-gray-50">
//                   {/* Items */}
//                   <div className="space-y-3 mb-4">
//                     <h3 className="font-medium">Items</h3>
//                     {order.items.map((item, index) => (
//                       <div key={index} className="flex justify-between text-sm">
//                         <span className="text-gray-600">
//                           {item.product_name} x {item.quantity}
//                         </span>
//                         <span className="font-medium">₹{item.total.toFixed(2)}</span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Shipping Details */}
//                   <div className="border-t pt-4">
//                     <h3 className="font-medium mb-2">Shipping Details</h3>
//                     <p className="text-sm text-gray-600">
//                       {order.shipping_details.full_name}<br />
//                       {order.shipping_details.address}<br />
//                       {order.shipping_details.city}<br />
//                       Phone: {order.shipping_details.phone}
//                     </p>
//                   </div>

//                   {/* Payment Info */}
//                   <div className="border-t pt-4 mt-4">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">Payment Method</span>
//                       <span className="font-medium capitalize">
//                         {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm mt-2">
//                       <span className="text-gray-600">Payment Status</span>
//                       <span className={`font-medium ${
//                         order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
//                       }`}>
//                         {order.payment_status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;



import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserOrders } from '../../store/orderSlice';
import { formatDistanceToNow } from 'date-fns';
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  CubeIcon,  // ✅ Using CubeIcon instead of PackageIcon
} from '@heroicons/react/24/outline';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'dispatched':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CubeIcon className="h-5 w-5 text-green-600" />; // ✅ Fixed: Using CubeIcon
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ShoppingBagIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'dispatched':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't placed any orders</p>
          <Link
            to="/products"
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-4 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.order_status)}
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </span>
                    <span className="font-bold text-indigo-600">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order._id && (
                <div className="p-4 bg-gray-50">
                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    <h3 className="font-medium">Items</h3>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product_name} x {item.quantity}
                        </span>
                        <span className="font-medium">₹{item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Details */}
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Shipping Details</h3>
                    <p className="text-sm text-gray-600">
                      {order.shipping_details.full_name}<br />
                      {order.shipping_details.address}<br />
                      {order.shipping_details.city}<br />
                      Phone: {order.shipping_details.phone}
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium capitalize">
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`font-medium ${
                        order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {order.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;