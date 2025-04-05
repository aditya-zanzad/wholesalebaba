import React, { useEffect, useState } from "react";
import { CheckCircle, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccessful = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("payment_id");
  const urlOrderId = queryParams.get("order_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputOrderId, setInputOrderId] = useState(urlOrderId || "");

  useEffect(() => {
    if (urlOrderId) {
      fetchOrderDetails(urlOrderId);
    } else {
      setLoading(false);
    }
  }, [urlOrderId]);

  const fetchOrderDetails = async (orderIdToFetch) => {
    if (!orderIdToFetch) {
      setError("Please enter an Order ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const { data } = await axios.get(`${backend}/api/orders/${orderIdToFetch}`);

      if (!data) {
        throw new Error("Order not found");
      }

      setOrder(data);
    } catch (err) {
      setError(err.message || "Failed to fetch order details");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchOrder = () => {
    fetchOrderDetails(inputOrderId);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to={-1} className="flex items-center text-blue-600 hover:text-blue-800">
            <Home className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Success Header */}
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-10 h-10 text-green-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Order Successful!</h1>
                <p className="text-gray-600">Thank you for shopping with us</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{order ? formatDate(order.createdAt) : "--/--/----"}</p>
            </div>
          </div>

          {/* Order ID Section */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-bold text-lg">{order?.order_id || "------"}</p>
              </div>
              {paymentId && (
                <div className="mt-2 sm:mt-0">
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-medium">{paymentId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fetch Order Form (if no URL order ID) */}
          {!urlOrderId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-medium mb-3">Enter Order Details</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={inputOrderId}
                  onChange={(e) => setInputOrderId(e.target.value)}
                  placeholder="Enter Order ID (e.g., order_Q4OJpMNtAIgFwk)"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleFetchOrder}
                  disabled={loading}
                  className={`px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Fetching..." : "Fetch Details"}
                </button>
              </div>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-600">Fetching order details...</p>
            </div>
          )}

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h2 className="font-medium">Delivery Address</h2>
                </div>
                <div className="p-4">
                  {order.shippingAddress ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">{order.shippingAddress.name}</p>
                        <p className="text-gray-600">{order.shippingAddress.street}</p>
                        <p className="text-gray-600">
                          {order.shippingAddress.city}, {order.shippingAddress.pincode}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Email:</span> {order.shippingAddress.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No shipping address provided</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h2 className="font-medium">Order Summary</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {order.products?.map((product, index) => (
                      <div key={index} className="flex border-b pb-4 last:border-b-0 last:pb-0">
                        {product.videoUrl && (
                          <div className="w-20 h-20 flex-shrink-0 mr-4">
                            <video
                              src={product.videoUrl}
                              className="w-full h-full object-cover rounded"
                              muted
                              loop
                              playsInline
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{product.category} ({product.size})</p>
                          <p className="text-gray-600 text-sm">Quantity: {product.quantity}</p>
                          <p className="text-gray-600 text-sm">₹{product.price.toFixed(2)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h2 className="font-medium">Payment Summary</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Total</span>
                      <span>₹{(order.amount / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="capitalize">{order.paymentMethod || "Online Payment"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <span className="text-green-600 font-medium">Paid</span>
                    </div>
                    <div className="pt-2 mt-2 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Total Amount Paid</span>
                        <span>₹{(order.amount / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h2 className="font-medium">Order Status</h2>
                </div>
                <div className="p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-px h-8 bg-gray-300 mt-1"></div>
                      </div>
                      <div>
                        <p className="font-medium">Order Confirmed</p>
                        <p className="text-gray-500 text-sm">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          order.status === "Shipped" ? "bg-green-500" : "bg-gray-300"
                        }`}>
                          {order.status === "Shipped" ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div className="w-px h-8 bg-gray-300 mt-1"></div>
                      </div>
                      <div>
                        <p className={`font-medium ${
                          order.status === "Shipped" ? "text-gray-800" : "text-gray-400"
                        }`}>Shipped</p>
                        {order.status === "Shipped" && order.updatedAt && (
                          <p className="text-gray-500 text-sm">
                            {formatDate(order.updatedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          order.status === "Delivered" ? "bg-green-500" : "bg-gray-300"
                        }`}>
                          {order.status === "Delivered" ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className={`font-medium ${
                          order.status === "Delivered" ? "text-gray-800" : "text-gray-400"
                        }`}>Delivered</p>
                        {order.status === "Delivered" && order.updatedAt && (
                          <p className="text-gray-500 text-sm">
                            {formatDate(order.updatedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Support */}
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Contact our customer support for any questions about your order
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href="mailto:support@example.com"
                    className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-all text-sm"
                  >
                    Email Support
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-sm"
                  >
                    Call Support
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Continue Shopping */}
        {order && (
          <div className="mt-6 text-center">
            <Link
              to="/categories"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessful;
