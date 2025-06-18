import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Package, 
  Lock, 
  DollarSign 
} from 'lucide-react';

const loadRazorpay = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    phone: '',
    paymentMethod: 'Online Payment',
  });
  const [errors, setErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  // Load cart items
  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cart);
    };
    loadCart();

    const handleStorageChange = (e) => {
      if (e.key === 'cart') loadCart();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const restoreScroll = () => {
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
  };

  // Calculate order totals
  const calculateSubtotal = () => 
    parseFloat(cartItems.reduce((total, item) => 
      total + (item.price || 0) * (item.quantity || 1), 0)).toFixed(2);

  const calculateShippingCharges = () => {
    const orderValue = parseFloat(calculateSubtotal());
    return orderValue < 2000 ? 140 : 140 + Math.floor((orderValue - 2000) / 500) * 30;
  };

  const calculateTotal = () => 
    (parseFloat(calculateSubtotal()) + calculateShippingCharges()).toFixed(2);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (apiError) setApiError(null);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    else if (formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email';

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    else if (formData.address.trim().length < 10) newErrors.address = 'Address must be at least 10 characters';

    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';

    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear purchased items from cart
  const clearPurchasedItemsFromCart = (purchasedItems) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      const purchasedItemUrls = new Set(purchasedItems.map((item) => item.videoUrl));
      const updatedCart = currentCart.filter((item) => !purchasedItemUrls.has(item.videoUrl));
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new Event('cart-updated'));
      
      return updatedCart;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return null;
    }
  };

  // Handle COD order submission
  const handleCreateCODOrder = async (transactionItems) => {
    const backend = import.meta.env.VITE_BACKEND_URL;
    const userId = localStorage.getItem('userId');
    const totalAmount = calculateTotal();

    const { data } = await axios.post(
      `${backend}/api/order/create-cod-order`,
      {
        amount: (totalAmount * 100).toString(), // Convert to paise
        user_id: userId,
        products: transactionItems.map((item) => ({
          videoUrl: item.videoUrl,
          price: item.price,
          quantity: item.quantity || 1,
          category: item.category,
          size: item.size,
        })),
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
      },
      { 
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!data?.success || !data?.order?.order_id) {
      throw new Error(data?.message || 'Failed to create COD order');
    }

    clearPurchasedItemsFromCart(transactionItems);
    navigate(`/order-confirmation/${data.order.order_id}`);
  };

  // Handle payment submission
  const handlePayment = async () => {
    if (isProcessingPayment) return;

    // Validate cart hasn't changed
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (currentCart.length !== cartItems.length) {
      setApiError('Your cart has changed. Please review your items before payment.');
      setCartItems(currentCart);
      return;
    }

    // Validate form
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to proceed.');
      return;
    }

    setIsProcessingPayment(true);
    setApiError(null);

    try {
      const transactionItems = [...cartItems];

      if (formData.paymentMethod === 'Cash on Delivery') {
        await handleCreateCODOrder(transactionItems);
      } else {
        // Online payment logic remains the same
        const backend = import.meta.env.VITE_BACKEND_URL;
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
        const userId = localStorage.getItem('userId');
        const totalAmount = calculateTotal();

        if (!razorpayKey) throw new Error('Payment gateway key missing');

        const razorpayLoaded = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');
        if (!razorpayLoaded) throw new Error('Failed to load payment gateway. Please try again.');

        const { data } = await axios.post(
          `${backend}/api/payment/create-order`,
          {
            amount: (totalAmount * 100).toString(),
            user_id: userId,
            products: transactionItems,
            shippingAddress: {
              name: formData.name,
              email: formData.email,
              street: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              phone: formData.phone,
            },
          },
          { timeout: 10000 }
        );

        if (!data?.id) throw new Error('Invalid response from payment gateway');

        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';

        const options = {
          key: razorpayKey,
          amount: data.amount,
          currency: data.currency || 'INR',
          name: 'Wholesale Baba',
          description: 'Product Purchase',
          order_id: data.id,
          handler: async (response) => {
            try {
              await axios.post(
                `${backend}/api/payment/confirm`,
                {
                  order_id: data.id,
                  payment_id: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                },
                { timeout: 10000 }
              );
              clearPurchasedItemsFromCart(transactionItems);
              restoreScroll();
              navigate(`/order-confirmation/${data.id}`);
            } catch (error) {
              console.error('Confirmation failed:', error);
              restoreScroll();
              setApiError('Payment succeeded but confirmation failed. Please contact support with order ID: ' + data.id);
            } finally {
              setIsProcessingPayment(false);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: '#2874f0' },
          modal: {
            ondismiss: () => {
              restoreScroll();
              setIsProcessingPayment(false);
              setApiError('Payment was cancelled. You can try again.');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          restoreScroll();
          setIsProcessingPayment(false);
          console.error('Payment failed:', response.error);
          setApiError(`Payment failed: ${response.error.description}. Please try again.`);
        });
        rzp.open();
      }
    } catch (error) {
      console.error('Payment error:', error);
      restoreScroll();
      setIsProcessingPayment(false);
      
      let errorMessage = 'Operation failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        
        if (error.response.data?.code === 'INSUFFICIENT_STOCK') {
          errorMessage = 'Some items in your cart are out of stock. Please update your cart.';
          const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
          setCartItems(currentCart);
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setApiError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
          {/* Delivery Address Section */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form fields for address */}
                {['name', 'email', 'address', 'pincode', 'city', 'state', 'phone'].map((field) => (
                  <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} *
                    </label>
                    <input
                      type={field === 'email' ? 'email' : field === 'phone' || field === 'pincode' ? 'tel' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`w-full p-3 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      placeholder={`Enter your ${field}`}
                      required
                      maxLength={field === 'pincode' ? 6 : field === 'phone' ? 10 : undefined}
                    />
                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>

              {/* Payment Method Selection */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="onlinePayment"
                      name="paymentMethod"
                      value="Online Payment"
                      checked={formData.paymentMethod === 'Online Payment'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="onlinePayment" className="ml-2 block text-sm font-medium text-gray-700">
                      Online Payment (Credit/Debit Card, UPI, Net Banking)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cashOnDelivery"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="cashOnDelivery" className="ml-2 block text-sm font-medium text-gray-700">
                      Cash on Delivery (Pay when you receive)
                    </label>
                  </div>
                </div>
                {formData.paymentMethod === 'Cash on Delivery' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">
                      Please have exact change ready. Our delivery executive will collect ₹{calculateTotal()} when your order is delivered.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow-sm rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Package className="w-6 h-6 text-blue-600 mr-2" />
                Order Summary
              </h2>
              
              <div className="space-y-4 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
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
              
              {apiError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {apiError}
                </div>
              )}
              
              <div className="mt-6">
                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className={`w-full py-3 ${
                    isProcessingPayment 
                      ? 'bg-yellow-500' 
                      : formData.paymentMethod === 'Cash on Delivery' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-yellow-400 hover:bg-yellow-500'
                  } text-gray-800 font-semibold rounded-md transition-colors flex items-center justify-center shadow-md`}
                >
                  {isProcessingPayment ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-800"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      {formData.paymentMethod === 'Cash on Delivery' ? (
                        <DollarSign className="w-5 h-5 mr-2" />
                      ) : (
                        <Lock className="w-5 h-5 mr-2" />
                      )}
                      {formData.paymentMethod === 'Cash on Delivery' ? 'Place COD Order' : 'Proceed to Payment'}
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
