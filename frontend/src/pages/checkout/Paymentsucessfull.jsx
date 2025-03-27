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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center max-w-3xl w-full">
        <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto animate-bounce" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-4">Payment Successful!</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Thank you for your purchase. Here are your order details.
        </p>

        {!urlOrderId && (
          <div className="mt-6 space-y-4">
            <input
              type="text"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., order_Q4OJpMNtAIgFwk)"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
            <button
              onClick={handleFetchOrder}
              disabled={loading}
              className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-md text-sm sm:text-base ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Fetching..." : "Fetch Order Details"}
            </button>
          </div>
        )}

        {loading && urlOrderId ? (
          <div className="mt-6 animate-pulse text-gray-500 text-sm sm:text-base">
            Loading order details...
          </div>
        ) : error ? (
          <div className="mt-6 text-red-500 text-sm sm:text-base">{error}</div>
        ) : (
          order && (
            <div className="mt-6 space-y-6">
              {/* Payment ID */}
              {order.payment_id && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-md text-sm text-gray-700">
                  <span className="font-medium">Payment ID:</span> {order.payment_id}
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-green-50 p-4 sm:p-6 rounded-md text-left">
                <h2 className="text-lg sm:text-xl font-semibold text-green-700 mb-2">Order Summary</h2>
                <p className="text-sm sm:text-base">
                  <span className="font-medium">Order ID:</span> {order.order_id}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-medium">Internal ID:</span> {order._id}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-medium">User ID:</span> {order.user_id}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-medium">Amount:</span> ₹{(order.amount / 100).toFixed(2)}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-medium">Currency:</span> {order.currency}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm ${
                      order.status === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-medium">Updated At:</span>{" "}
                  {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-md text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Shipping Address</h2>
                  <p className="text-sm sm:text-base">
                    <span className="font-medium">Name:</span> {order.shippingAddress.name}
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="font-medium">Street:</span> {order.shippingAddress.street}
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="font-medium">City:</span> {order.shippingAddress.city},{" "}
                    {order.shippingAddress.pincode}
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="font-medium">Phone:</span> 📞 {order.shippingAddress.phone}
                  </p>
                  <p className="text-sm sm:text-base">
                    <span className="font-medium">Email:</span> 📧 {order.shippingAddress.email}
                  </p>
                </div>
              )}

              {/* Products */}
              {order.products && order.products.length > 0 && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-md text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Products</h2>
                  <div className="space-y-6">
                    {order.products.map((product) => (
                      <div
                        key={product._id}
                        className="border-b py-4 flex flex-col sm:flex-row gap-4 items-start"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="text-sm sm:text-base font-medium text-gray-800">
                            Product ID: {product._id}
                          </p>
                          <p className="text-sm sm:text-base text-gray-600">
                            <span className="font-medium">Price:</span> ₹{(product.price / 100).toFixed(2)}
                          </p>
                          <p className="text-sm sm:text-base text-gray-600">
                            <span className="font-medium">Quantity:</span> {product.quantity || "N/A"}
                          </p>
                          <p className="text-sm sm:text-base text-gray-600">
                            <span className="font-medium">Size:</span> {product.size || "N/A"}
                          </p>
                          <p className="text-sm sm:text-base text-gray-600">
                            <span className="font-medium">Category:</span> {product.category || "N/A"}
                          </p>
                        </div>
                        {product.videoUrl && (
                          <div className="w-full sm:w-48">
                            <video
                              src={product.videoUrl}
                              controls
                              className="w-full h-32 sm:h-24 rounded-md shadow-sm object-cover"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Home */}
              <Link
                to="/"
                className="mt-6 inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md text-sm sm:text-base"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessful;