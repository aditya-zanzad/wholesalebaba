import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Package, Lock } from "lucide-react";

const loadRazorpay = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    pincode: "",
    city: "",
    phone: "",
    paymentMethod: "Online Payment",
  });
  const [errors, setErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
    
    // Cleanup function to ensure scroll is restored if component unmounts
    return () => {
      restoreScroll();
    };
  }, []);

  const restoreScroll = () => {
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.height = 'auto';
    document.body.style.width = 'auto';
  };

  const calculateSubtotal = () => parseFloat(cartItems
    .reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0))
    .toFixed(2);

  const calculateShippingCharges = () => {
    const orderValue = parseFloat(calculateSubtotal());
    if (orderValue < 2000) return 140;
    return 140 + Math.floor((orderValue - 2000) / 500) * 30;
  };

  const calculateTotal = () => (
    parseFloat(calculateSubtotal()) + calculateShippingCharges()
  ).toFixed(2);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.pincode?.match(/^\d{6}$/)) newErrors.pincode = "Valid 6-digit Pincode required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.phone?.match(/^\d{10}$/)) newErrors.phone = "Valid 10-digit Phone required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (isProcessingPayment) return;
    
    if (!validateForm()) {
      alert("Please fix form errors before proceeding");
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      if (!await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js")) {
        alert("Failed to load payment gateway");
        setIsProcessingPayment(false);
        return;
      }

      const backend = import.meta.env.VITE_BACKEND_URL;
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please login to continue");
        setIsProcessingPayment(false);
        return;
      }

      const { data } = await axios.post(`${backend}/api/payment/create-order`, {
        amount: calculateTotal() * 100,
        user_id: userId,
        products: cartItems.map(item => ({
          videoUrl: item.videoUrl,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          size: item.size,
        })),
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          street: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          phone: formData.phone
        }
      });

      // Lock scroll before opening modal
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "Video Store",
        description: "Video Purchase",
        order_id: data.id,
        handler: async (response) => {
          try {
            await axios.post(`${backend}/api/payment/confirm`, {
              order_id: data.id,
              payment_id: response.razorpay_payment_id
            });
            localStorage.removeItem("cart");
            restoreScroll();
            window.location.href = `/order-confirmation/${data.id}`;
          } catch (error) {
            console.error("Confirmation failed:", error);
            restoreScroll();
            alert("Payment succeeded but confirmation failed. Contact support.");
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: formData,
        theme: { color: "#2874f0" },
        modal: { 
          ondismiss: () => {
            restoreScroll();
            setIsProcessingPayment(false);
            alert("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        restoreScroll();
        setIsProcessingPayment(false);
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      restoreScroll();
      setIsProcessingPayment(false);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <Link to="/cart" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Back to Cart</span>
            </Link>
            <div className="flex items-center">
              <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">100% Secure Payment</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Delivery Details */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData).map(([key, value]) => (
                  key !== "paymentMethod" && (
                    <div key={key} className={key === "address" ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)} *
                      </label>
                      <input
                        type={key === "email" ? "email" : "text"}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder={`Enter ${key}`}
                        required
                      />
                      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow-sm rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Package className="w-6 h-6 text-blue-600 mr-2" />
                Order Summary
              </h2>

              <div className="space-y-4 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Charges</span>
                  <span>₹{calculateShippingCharges()}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold mt-4">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{calculateTotal()}</span>
              </div>

              <div className="mt-6">
                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className={`w-full py-3 ${isProcessingPayment ? 'bg-yellow-500' : 'bg-yellow-400'} text-gray-800 font-semibold rounded-md hover:bg-yellow-500 transition-colors flex items-center justify-center shadow-md`}
                >
                  {isProcessingPayment ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Safe and Secure Payments. Easy returns. 100% Authentic products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
