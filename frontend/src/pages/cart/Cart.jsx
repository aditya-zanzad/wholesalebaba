import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Lock, RefreshCw } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productStocks, setProductStocks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
      await fetchProductStocks(cart);
      setIsLoading(false);
    };
    loadCart();
  }, []);

  const fetchProductStocks = async (cartItems) => {
    setIsRefreshing(true);
    try {
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const stocks = {};
      
      const stockPromises = cartItems.map(async (item) => {
        try {
          const response = await fetch(`${backend}/api/videos/stock/${item.id}`);
          if (response.ok) {
            const data = await response.json();
            return { id: item.id, quantity: data.quantity };
          }
          return { id: item.id, quantity: item.quantity || 1 };
        } catch (error) {
          console.error(`Error fetching stock for ${item.id}:`, error);
          return { id: item.id, quantity: item.quantity || 1 };
        }
      });

      const stockResults = await Promise.all(stockPromises);
      stockResults.forEach(({ id, quantity }) => {
        stocks[id] = quantity;
      });
      
      setProductStocks(stocks);
    } catch (error) {
      console.error("Error fetching product stocks:", error);
      const fallbackStocks = {};
      cartItems.forEach(item => {
        fallbackStocks[item.id] = item.quantity || 1;
      });
      setProductStocks(fallbackStocks);
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    updateCart(updatedCart);
    fetchProductStocks(updatedCart);
  };

  // Updated to match CloudinaryPlayer's behavior
  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    const item = updatedCart[index];
    const availableStock = productStocks[item.id] ?? item.quantity ?? 1;
    
    const newQuantity = (item.quantity || 1) + 1;
    
    if (newQuantity <= availableStock) {
      updatedCart[index].quantity = newQuantity;
      updateCart(updatedCart);
    } else {
      alert(`Only ${availableStock} available`);
    }
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updateCart(updatedCart);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
      .toFixed(2);
  };

  const calculateShipping = () => {
    const subtotal = parseFloat(calculateTotal());
    return subtotal >= 500 ? 0 : 140;
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = calculateTotal();
  const shipping = calculateShipping();
  const total = (parseFloat(subtotal) + shipping).toFixed(2);
  const isCheckoutDisabled = parseFloat(total) < 2000;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
            <ShoppingBag className="w-6 h-6 text-blue-600 mr-2" />
            My Cart ({totalQuantity})
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchProductStocks(cartItems)}
              disabled={isRefreshing}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Availability
            </button>
            <Link
              to="/categories"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add items to it now!</p>
            <Link
              to="/categories"
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all shadow-md"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                {cartItems.map((item, index) => {
                  const availableStock = productStocks[item.id] ?? item.quantity ?? 1;
                  const isMaxQuantity = (item.quantity || 1) >= availableStock;
                  
                  return (
                    <div
                      key={index}
                      className="p-4 sm:p-6 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Product Image/Video */}
                        <div className="w-24 h-24 flex-shrink-0">
                          <video
                            src={item.videoUrl}
                            className="w-full h-full object-cover rounded-md border border-gray-200"
                            muted
                            loop
                            playsInline
                            onMouseOver={(e) => e.target.play()}
                            onMouseOut={(e) => e.target.pause()}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-800">{item.category}</h3>
                              <p className="text-sm text-gray-600">Size: {item.size}</p>
                              <p className="text-lg font-semibold text-gray-900 mt-1">
                                ₹{(item.price || 0).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Available: {availableStock}
                              </p>
                            </div>

                            {/* Updated Quantity Controls to match CloudinaryPlayer */}
                            <div className="flex items-center mt-3 sm:mt-0">
                              <button
                                onClick={() => decreaseQuantity(index)}
                                className="p-1 border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50"
                                disabled={item.quantity === 1}
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="px-4 py-1 border-t border-b border-gray-300 text-gray-800 font-medium">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() => increaseQuantity(index)}
                                className={`p-1 border border-gray-300 rounded-r-md hover:bg-gray-100 ${
                                  isMaxQuantity ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={isMaxQuantity}
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Subtotal and Remove */}
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm font-medium text-gray-700">
                              Subtotal: ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="text-red-500 hover:text-red-600 flex items-center text-sm font-medium"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white shadow-sm rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                 
                </div>
                <div className="flex justify-between text-lg font-semibold mt-4">
                  <span>Total</span>
                  <span className="text-blue-600">₹{total}</span>
                </div>
                {parseFloat(total) < 2000 && (
                  <p className="text-sm text-red-500 mt-2">
                    Add ₹{(2000 - parseFloat(total)).toFixed(2)} more to enable checkout
                  </p>
                )}
                <Link
                  to={isCheckoutDisabled ? "#" : "/checkout"}
                  className={`block w-full py-3 mt-6 text-center font-semibold rounded-md transition-all shadow-md ${
                    isCheckoutDisabled
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
                  } flex items-center justify-center`}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Link>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Safe and Secure Payments
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
