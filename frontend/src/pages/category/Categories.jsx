import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Settings, LogOut, User, Menu } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo1 from "../../assets/logo1.png";

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
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const endpoint = isAdmin ? "/api/categories" : "/api/categories";
        const response = await axios.get(`${backend}${endpoint}`);
        
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          setError("Failed to load categories");
          toast.error("Failed to load categories");
        }
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
        toast.error("Failed to load categories");
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();

    // Cart item count setup
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItemCount(cart.length);

    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemCount(updatedCart.length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isAdmin]);

  // Toggle category enabled status
  const toggleCategoryStatus = async (categoryId, currentStatus) => {
    try {
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const endpoint = currentStatus ? 'disable' : 'enable';
      
      await axios.patch(`${backend}/api/categories/${categoryId}/${endpoint}`);
      
      setCategories(categories.map(category => 
        category._id === categoryId 
          ? { ...category, enabled: !currentStatus } 
          : category
      ));
      
      toast.success(`Category ${currentStatus ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${currentStatus ? 'disable' : 'enable'} category`);
      console.error("Error toggling category status:", error);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // Submit user query
  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const userId = localStorage.getItem("userId");
      const name = localStorage.getItem("userName");
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      
      const response = await axios.post(`${backend}/api/queries`, {
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
      
      toast.success("Query submitted successfully!");
      setTimeout(() => setQuerySubmitted(false), 3000);
    } catch (error) {
      toast.error("Failed to submit query");
      console.error("Error submitting query:", error);
    }
  };

  // Fetch query responses
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

  // Load query responses
  useEffect(() => {
    if (queryIds.length > 0) {
      queryIds.forEach((id) => {
        if (!queryResponses[id]) {
          fetchQueryResponse(id);
        }
      });
    }
  }, [queryIds]);

  if (loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-lg">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Web Navigation */}
      <nav className="hidden md:block bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo1} className="h-14 transition-transform hover:scale-105" alt="Logo" />
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
            <img src={logo1} className="h-12" alt="Logo" />
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
          {categories
            .filter(category => isAdmin || category.enabled)
            .map((category) => (
              <div key={category._id} className="group relative">
                <Link 
                  to={category.enabled ? `/categories/${category.name.toLowerCase()}/sizes` : '#'}
                  className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-500 bg-white block ${
                    category.enabled ? 'hover:-translate-y-2' : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Available";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    {!category.enabled && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold">DISABLED</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-end justify-center p-6">
                    <h3 className="text-white font-bold text-xl capitalize">
                      {category.name}
                    </h3>
                  </div>
                </Link>
                
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCategoryStatus(category._id, category.enabled);
                    }}
                    className={`absolute top-2 right-2 z-10 px-3 py-1 rounded-full text-xs font-bold ${
                      category.enabled 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {category.enabled ? 'Enable' : 'Disable'}
                  </button>
                )}
              </div>
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
    </div>
  );
};

export default Categories;