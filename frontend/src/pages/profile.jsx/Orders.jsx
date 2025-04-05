import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, Download, CreditCard } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Paid"); // Default to showing paid orders

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const { data } = await axios.get(`${backend}/api/users/orders`);

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from server");
        }

        setOrders(data);
      } catch (error) {
        setError(error.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on status (case-insensitive)
  const filteredOrders = filterStatus === "All"
    ? orders
    : orders.filter((order) => order.status.toLowerCase() === filterStatus.toLowerCase());

  // Export to CSV - only paid orders by default
  const exportToCSV = () => {
    const ordersToExport = filterStatus === "All" 
      ? orders.filter(order => order.status.toLowerCase() === "paid")
      : filteredOrders;

    const csvContent = [
      ["Order ID", "User ID", "Customer", "Date", "Amount", "Status"],
      ...ordersToExport.map((order) => [
        order.order_id,
        order.userId || "N/A",
        order.shippingAddress?.name || "N/A",
        new Date(order.createdAt).toLocaleDateString(),
        `₹${(order.amount / 100).toFixed(2)}`,
        order.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filterStatus === "All" ? "paid_orders.csv" : `${filterStatus.toLowerCase()}_orders.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4 animate-pulse">⚠️</div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center mb-4 sm:mb-0">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-indigo-600 animate-bounce" />
            {filterStatus === "All" ? "All Orders" : `${filterStatus} Orders`}
          </h1>
          <button
            onClick={exportToCSV}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md"
          >
            <Download className="w-5 h-5 mr-2" />
            Export {filterStatus === "All" ? "Paid" : filterStatus} Orders
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-3 justify-center sm:justify-start">
          {["Paid", "Processing", "Shipped", "All"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm sm:text-base ${
                filterStatus === status
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-indigo-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders Table or Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500 text-lg sm:text-xl font-medium">
              No {filterStatus.toLowerCase()} orders found.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="p-3 sm:p-4 font-semibold">Order ID</th>
                    <th className="p-3 sm:p-4 font-semibold">User ID</th>
                    <th className="p-3 sm:p-4 font-semibold">Customer</th>
                    <th className="p-3 sm:p-4 font-semibold">Date</th>
                    <th className="p-3 sm:p-4 font-semibold">Amount</th>
                    <th className="p-3 sm:p-4 font-semibold">Status</th>
                    <th className="p-3 sm:p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order.order_id}
                      className={`border-b hover:bg-indigo-50 transition-all ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-3 sm:p-4 font-medium text-gray-800">{order.order_id}</td>
                      <td className="p-3 sm:p-4 text-gray-700 font-mono">
                        {order.userId || "N/A"}
                      </td>
                      <td className="p-3 sm:p-4 text-gray-700">
                        {order.shippingAddress?.name || "N/A"}
                      </td>
                      <td className="p-3 sm:p-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 sm:p-4 font-medium text-gray-800">
                        ₹{(order.amount / 100).toFixed(2)}
                      </td>
                      <td className="p-3 sm:p-4">
                        <span
                          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm ${
                            order.status === "Shipped"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "Paid"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status === "Shipped" && (
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-pulse" />
                          )}
                          {order.status === "Processing" && (
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin-slow" />
                          )}
                          {order.status === "Paid" && (
                            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          )}
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4">
                        <Link
                          to={`/payment_success`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors text-sm sm:text-base"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
