import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllOrders,
  updateOrderStatus,
} from '../../store/orderSlice';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import {
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const ManageOrders = () => {
  const dispatch = useDispatch();
  const { allOrders: orders, stats, loading } = useSelector((state) => state.orders);
  
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({
        orderId,
        orderStatus: newStatus
      })).unwrap();
      toast.success('Order status updated');
      dispatch(fetchAllOrders());
    } catch (error) {
      toast.error(error || 'Failed to update status');
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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.order_status === filter);

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          {stats.map((stat) => (
            <div key={stat._id} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 capitalize">{stat._id}</p>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-xs text-gray-500">₹{stat.total.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y">
        {filteredOrders.map((order) => (
          <div key={order._id} className="p-4 hover:bg-gray-50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                  <p className="font-medium">Order #{order._id.slice(-8)}</p>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  <p>Customer: {order.user?.name || 'Unknown'}</p>
                  <p>Total: ₹{order.total_amount.toFixed(2)} • {formatDate(order.created_at)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetails(true);
                  }}
                  className="p-2 text-gray-600 hover:text-indigo-600"
                  title="View Details"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>

                {/* Status Update Buttons */}
                {order.order_status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                  >
                    Confirm
                  </button>
                )}
                {order.order_status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'dispatched')}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                  >
                    Dispatch
                  </button>
                )}
                {order.order_status === 'dispatched' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'delivered')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                  >
                    Deliver
                  </button>
                )}
                {order.order_status !== 'cancelled' && order.order_status !== 'delivered' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">Order Details #{selectedOrder._id.slice(-8)}</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium mb-2">Customer Information</h4>
                <p className="text-sm">Name: {selectedOrder.user?.name}</p>
                <p className="text-sm">Email: {selectedOrder.user?.email}</p>
                <p className="text-sm">Role: {selectedOrder.user?.role}</p>
              </div>

              {/* Shipping Details */}
              <div>
                <h4 className="font-medium mb-2">Shipping Details</h4>
                <p className="text-sm">{selectedOrder.shipping_details.full_name}</p>
                <p className="text-sm">{selectedOrder.shipping_details.address}</p>
                <p className="text-sm">{selectedOrder.shipping_details.city}</p>
                <p className="text-sm">Phone: {selectedOrder.shipping_details.phone}</p>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span className="font-medium">₹{item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold text-indigo-600">
                    ₹{selectedOrder.total_amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Payment Method:</span>
                  <span className="capitalize">{selectedOrder.payment_method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Status:</span>
                  <span className={selectedOrder.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                    {selectedOrder.payment_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;