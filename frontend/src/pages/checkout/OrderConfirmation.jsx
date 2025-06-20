import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Package, Truck } from 'lucide-react';
import axios from 'axios';
import React from 'react';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${backend}/api/orders/${orderId}`);

        if (!data) {
          throw new Error('Order not found');
        }

        setOrder(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Calculate subtotal
  const calculateSubtotal = () => {
    return order?.products?.reduce((sum, product) => {
      return sum + (product.price * (product.quantity || 1));
    }, 0) || 0;
  };

  // Calculate shipping charges
  const calculateShippingCharges = () => {
    const orderValue = parseFloat(calculateSubtotal());
    return orderValue < 2000 ? 140 : 140 + Math.floor((orderValue - 2000) / 500) * 30;
  };

  // Get shipping charges
  const shippingCharges = order?.shipping_charges ? parseFloat(order.shipping_charges) : calculateShippingCharges();

  // Calculate total amount
  const totalAmount = order?.total_order_value ? (order.total_order_value / 100) : (calculateSubtotal() + shippingCharges);

  // Calculate partial payment amounts (if applicable)
  const partialPayment = order?.payment_type === 'partial' ? {
    upfront: order.amount / 100, // Amount paid upfront
    cod: order.pending_cod_amount / 100 // Amount due on delivery
  } : null;

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/orders" className="text-indigo-600 hover:text-indigo-800">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Order not found</p>
        <Link to="/orders" className="text-indigo-600 hover:text-indigo-800">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 mr-4" />
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          </div>

          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <p className="mb-2">
                <strong>Order ID:</strong> {order.order_id || 'N/A'}
              </p>
              <p className="mb-2">
                <strong>Date:</strong>{" "}
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </p>
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span className="text-green-600">{order.payment_status || order.status || 'Processing'}</span>
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
              <p className="mb-2">
                <strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}
              </p>
              {partialPayment && (
                <>
                  <p className="mb-2">
                    <strong>Paid Upfront (25%):</strong> ₹{partialPayment.upfront.toFixed(2)}
                  </p>
                  <p className="mb-2">
                    <strong>COD Amount (75%):</strong> ₹{partialPayment.cod.toFixed(2)}
                  </p>
                </>
              )}
              <p className="mb-2">
                <strong>Payment ID:</strong> {order.payment_id || 'N/A'}
              </p>
              <p className="mb-2">
                <strong>Payment Method:</strong> {order.payment_type === 'partial' ? 'Partial Payment (UPI + COD)' : 'Online Payment'}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <p className="mb-1">{order.shippingAddress.name || 'N/A'}</p>
              <p className="mb-1">{order.shippingAddress.street || ''}</p>
              <p className="mb-1">
                {order.shippingAddress.city || ''}{order.shippingAddress.pincode ? `, ${order.shippingAddress.pincode}` : ''}
              </p>
              <p className="mb-1">📞 {order.shippingAddress.phone || 'N/A'}</p>
              <p className="mb-1">📧 {order.shippingAddress.email || 'N/A'}</p>
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t pt-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="w-6 h-6 mr-2" />
              Order Summary
            </h2>
            
            {/* Products List */}
            <div className="space-y-4 mb-4">
              {order.products && order.products.length > 0 ? (
                order.products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{product.category} ({product.size})</p>
                      <p className="text-sm text-gray-500">Qty: {product.quantity || 1}</p>
                    </div>
                    <p className="font-medium">
                      ₹{(product.price * (product.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items found in this order.</p>
              )}
            </div>
            
            {/* Order Totals */}
            <div className="border-t pt-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Shipping
                </span>
                <span className="font-medium">₹{shippingCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t mt-2">
                <span className="font-semibold">Total</span>
                <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">
            <Clock className="inline-block w-5 h-5 mr-2" />
            Your order will be processed within 24 hours
          </p>
          <Link to="/categories" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
