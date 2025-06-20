import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./file.css";

const CloudinaryPlayer = () => {
  const [videoData, setVideoData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [animatedDiscount, setAnimatedDiscount] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const videoRefs = useRef([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = (queryParams.get("category") || "SHIRTS").toUpperCase();
  const selectedSize = (queryParams.get("size") || "M").toUpperCase();

  useEffect(() => {
    const fetchVideosAndPrices = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(
          `${backend}/api/videos/data/${selectedCategory}/${selectedSize}`
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setVideoData(data.videoData);
      } catch (error) {
        console.error("Error fetching videos and prices:", error);
      }
    };

    fetchVideosAndPrices();
  }, [selectedCategory, selectedSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch((err) => console.error("Autoplay failed:", err));
            video.muted = false;
          } else {
            video.pause();
            video.muted = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videoData]);

  useEffect(() => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(existingCart.length);
  }, []);

  useEffect(() => {
    setSelectedQuantity(1);
  }, [currentIndex]);

  useEffect(() => {
    setAnimatedDiscount(0);
    let start = 0;
    const targetDiscount = 60;

    const interval = setInterval(() => {
      if (start < targetDiscount) {
        start++;
        setAnimatedDiscount(start);
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNextReel = () => {
    if (videoData.length === 0) {
      alert(
        `No videos available for ${selectedCategory} - Size ${selectedSize}`
      );
      return;
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoData.length);
  };

  const handleAddToCart = () => {
    if (videoData.length === 0 || currentIndex >= videoData.length) return;
    
    const currentVideo = videoData[currentIndex];
    if (currentVideo.quantity <= 0) {
      alert("This item is out of stock");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if this exact product is already in cart
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === currentVideo.id && item.size === selectedSize
    );

    const availableQuantity = currentVideo.quantity;
    const quantityToAdd = Math.min(selectedQuantity, availableQuantity);

    if (existingItemIndex !== -1) {
      // Calculate new total quantity
      const newTotalQuantity = existingCart[existingItemIndex].quantity + quantityToAdd;
      
      if (newTotalQuantity > availableQuantity) {
        alert(`You can only add ${availableQuantity - existingCart[existingItemIndex].quantity} more of this item`);
        return;
      }
      
      existingCart[existingItemIndex].quantity = newTotalQuantity;
    } else {
      // Add new item to cart
      existingCart.push({
        id: currentVideo.id,
        videoUrl: currentVideo.videoUrl,
        category: selectedCategory,
        size: selectedSize,
        price: currentVideo.price,
        quantity: quantityToAdd,
        productId: currentVideo.id
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCartCount(existingCart.length);
    
    // Trigger cart update event for other components
    window.dispatchEvent(new Event('storage'));
    
    alert("Added to cart 🛒");
  };

  const handleQuantityChange = (change) => {
    const currentVideo = videoData[currentIndex];
    if (!currentVideo) return;

    const newQuantity = selectedQuantity + change;
    if (newQuantity < 1) return;
    if (newQuantity > currentVideo.quantity) {
      alert(`Only ${currentVideo.quantity} available`);
      return;
    }
    setSelectedQuantity(newQuantity);
  };

  return (
    <div className="reel-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {videoData.length > 0 && currentIndex < videoData.length ? (
        <div className="video-wrapper relative">
          <video
            key={videoData[currentIndex].videoUrl}
            ref={(el) => {
              if (el) videoRefs.current[currentIndex] = el;
            }}
            controls
            loop
            playsInline
            autoPlay
            className="reel-video rounded-lg shadow-md w-full max-w-md"
          >
            <source src={videoData[currentIndex].videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white px-4 py-2 rounded-md">
            {videoData[currentIndex]?.price !== undefined && (() => {
              const discountedPrice = videoData[currentIndex].price;
              const discountPercentage = 60;
              const originalPrice = (discountedPrice / (1 - discountPercentage / 100)).toFixed(2);
              const isOutOfStock = videoData[currentIndex].quantity === 0;

              return (
                <>
                  <p className="text-md font-semibold flex items-center justify-between">
                    <span>
                      {selectedCategory} | Size: {selectedSize} |
                      <span className="text-gray-400 line-through ml-2">
                        Price: ₹{originalPrice}
                      </span> | 
                    </span>
                    <Link to='/cart'>
                      <button className="ml-2 px-3 py-2 text-sm font-bold text-white bg-blue-500 rounded-sm shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all transform hover:scale-110 flex items-center gap-2 relative">
                        Cart
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
                            {cartCount}
                          </span>
                        )}
                      </button>
                    </Link>
                  </p>

                  <p className="text-lg font-bold text-yellow-600">
                    Wholesale Price: ₹{discountedPrice} (
                    <span className="text-white text-sm">
                      {animatedDiscount}% OFF
                    </span>)
                  </p>
                  <p className={`text-sm ${isOutOfStock ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    {isOutOfStock ? "Out of Stock" : `Available: ${videoData[currentIndex].quantity} | Selected: ${selectedQuantity}`}
                  </p>
                </>
              );
            })()}
          </div>

          <div className="absolute bottom-3 left-0 right-0 flex justify-between items-center w-full px-4">
            <button
              className="text-3xl text-gray-700 hover:text-gray-900 transition-transform transform hover:scale-125"
              onClick={() =>
                setCurrentIndex(
                  (prevIndex) =>
                    (prevIndex - 1 + videoData.length) % videoData.length
                )
              }
            >
              ⏮️
            </button>

            <button
              className="text-3xl text-blue-600 hover:text-indigo-800 transition-transform transform hover:scale-125"
              onClick={handleNextReel}
            >
              ⏭️
            </button>

            <div className="flex items-center gap-4">
              {videoData[currentIndex]?.quantity > 0 && (
                <div className="flex items-center gap-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded font-bold text-2xl">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={selectedQuantity === 1}
                    className={`px-4 ${selectedQuantity === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    -
                  </button>
                  <span className="min-w-[20px] text-center">{selectedQuantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={selectedQuantity >= videoData[currentIndex].quantity}
                    className={`px-4 ${selectedQuantity >= videoData[currentIndex].quantity ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    +
                  </button>
                </div>
              )}

              <button
                className={`px-3 py-1.5 text-sm font-bold text-white rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center gap-2 ${
                  videoData[currentIndex].quantity === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-yellow-600 hover:shadow-xl'
                }`}
                onClick={handleAddToCart}
                disabled={videoData[currentIndex].quantity === 0}
              >
                Add to Cart{" "}
                <span className="text-xl bg-black rounded-full p-2">🛒</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">
          {videoData.length === 0 
            ? `No videos available for ${selectedCategory} - Size ${selectedSize}.`
            : "Loading videos..."}
        </p>
      )}
    </div>
  );
};

export default CloudinaryPlayer;
