import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Settings, LogOut, User, Menu } from "lucide-react";
import shirt from "../../assets/shirt.png";
import kurta from "../../assets/kurta.png";
import ModiJacket from "../../assets/jacket.png";
import endowestern from "../../assets/endowestern.png";
import logo1 from "../../assets/logo1.png";
import axios from "axios";

const categories = [
  { name: "Shirts", image: shirt, color: "from-blue-600 to-indigo-700" },
  { name: "Kurta", image: kurta, color: "from-rose-600 to-pink-700" },
  { name: "ModiJacket", image: ModiJacket, color: "from-green-600 to-teal-700" },
  { name: "EndoWestern", image: endowestern, color: "from-purple-600 to-indigo-700" },
];

const Categories = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("userRole") === "admin";
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userName = localStorage.getItem("userName") || "User";
  const [query, setQuery] = useState("");
  const [querySubmitted, setQuerySubmitted] = useState(false);
  const [queryIds, setQueryIds] = useState(JSON.parse(localStorage.getItem("queryIds")) || []);
  const [queryResponses, setQueryResponses] = useState({});
  const [loadingResponse, setLoadingResponse] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItemCount(cart.length);

    const handleStorageChange = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemCount(cart.length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (queryIds.length > 0) {
      queryIds.forEach((id) => {
        if (!queryResponses[id]) {
          fetchQueryResponse(id);
        }
      });
    }
  }, [queryIds]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const userId = localStorage.getItem("userId");
      const name = localStorage.getItem("userName");
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/queries`, {
        userId,
        name,
        query,
        submittedAt: new Date(),
      });

      const newQueryId = response.data.query._id;
      setQuerySubmitted(true);
      setQuery("");
      setQueryIds((prev) => {
        const updatedIds = [...prev, newQueryId];
        localStorage.setItem("queryIds", JSON.stringify(updatedIds));
        return updatedIds;
      });
      setTimeout(() => setQuerySubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting query:", error);
      alert("Failed to submit query. Please try again.");
    }
  };

  const fetchQueryResponse = async (id) => {
    setLoadingResponse(true);
    try {
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const { data } = await axios.get(`${backend}/api/queries/${id}`);
      setQueryResponses((prev) => ({
        ...prev,
        [id]: data.success && data.query ? data.query.response || "No response yet." : "No response yet.",
      }));
    } catch (error) {
      console.error("Error fetching query response:", error);
      setQueryResponses((prev) => ({ ...prev, [id]: "Failed to fetch response." }));
    } finally {
      setLoadingResponse(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Web Navigation */}
      <nav className="hidden md:block bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo1} className="h-14 transition-transform hover:scale-105" alt="FashionReels" />
          </Link>
          <div className="flex items-center gap-8">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-semibold hover:bg-indigo-200 transition-all duration-300"
            >
              <User className="w-5 h-5" />
              My Orders
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-semibold hover:shadow-md transition-all duration-300 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{cartItemCount}</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-md transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full font-semibold hover:shadow-md transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo1} className="h-12" alt="FashionReels" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 bg-orange-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        {showMobileMenu && (
          <div className="absolute w-full bg-white shadow-lg py-4 px-4 space-y-4 animate-slide-down">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-medium text-sm truncate">{userName}</span>
            </div>
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-700 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              My Orders
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 text-gray-700 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="pt-20 md:pt-28 pb-12 px-6">
        {/* Web Heading */}
        <div className="hidden md:block text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 animate-fade-in">
            Discover Your Style
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unleash your fashion with our exclusive collections designed for every vibe.
          </p>
        </div>

        {/* Mobile Heading */}
        <h1 className="md:hidden text-3xl font-extrabold text-gray-900 mb-8 text-center animate-fade-in">
          Shop Categories
        </h1>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/categories/${category.name.toLowerCase()}/sizes`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500"
            >
              <div className="aspect-square relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity duration-300" />
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end justify-center p-6`}
              >
                <div className="text-center text-white">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-wide group-hover:tracking-wider transition-all duration-300">
                    {category.name}
                  </h2>
                  <p className="text-sm md:text-base mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop Now →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Query Box */}
        <div className="mt-16 max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 text-center">
            Got a Question?
          </h2>
          <form onSubmit={handleQuerySubmit} className="space-y-6">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask us anything..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-36 transition-all duration-300"
              disabled={querySubmitted}
            />
            <button
              type="submit"
              disabled={querySubmitted || !query.trim()}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                querySubmitted
                  ? "bg-green-600"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              }`}
            >
              {querySubmitted ? "Query Submitted!" : "Submit Query"}
            </button>
          </form>

          {/* Display Query Responses */}
          {queryIds.length > 0 && (
            <div className="mt-8 space-y-4">
              {queryIds.slice(-2).reverse().map((id) => (
                <div key={id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {queryIds[queryIds.length - 1] === id ? "Latest Response" : "Previous Response"}
                  </h3>
                  {loadingResponse && !queryResponses[id] ? (
                    <p className="text-gray-500 animate-pulse">Loading...</p>
                  ) : queryResponses[id] ? (
                    <p className="text-sm text-gray-700">{queryResponses[id]}</p>
                  ) : (
                    <p className="text-sm text-gray-500">No response yet.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="flex justify-around items-center h-16">
            <Link to="/" className="text-gray-700 p-3 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/cart" className="text-gray-700 p-3 relative hover:text-orange-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="text-gray-700 p-3 hover:text-indigo-600 transition-colors">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Web Footer */}
        <footer className="hidden md:block mt-16 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 FashionReels. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Inline CSS for Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-down {
            animation: slideDown 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Categories;