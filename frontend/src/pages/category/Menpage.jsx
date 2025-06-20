import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import menImage from "../../assets/man.png";
import { FaHandPointer, FaArrowRight } from "react-icons/fa";

const MenPage = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showClickPrompt, setShowClickPrompt] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowClickPrompt(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageClick = () => {
    setIsClicked(true);
    setTimeout(() => navigate("/categories"), 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4 overflow-hidden">
      {isClicked && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="text-white text-lg sm:text-2xl font-light flex items-center">
            <span>
              <FaArrowRight className="mr-2 sm:mr-3" />
            </span>
            Entering Collection...
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full mx-auto">
        <h1
          className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800 text-center mb-6 sm:mb-8 tracking-tight"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-gray-900 to-black">
            Men's Premium Collection
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Premium Image Card */}
          <div
            className="relative group cursor-pointer"
            onClick={handleImageClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200/50">
              <img
                src={menImage}
                alt="Men's Premium Collection"
                className="w-full h-[300px] sm:h-[400px] md:h-[550px] object-cover object-top"
              />

              {/* Click Prompt */}
              {showClickPrompt && (
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 sm:p-3 shadow-xl backdrop-blur-sm flex items-center space-x-1 sm:space-x-2">
                  <div>
                    <FaHandPointer className="text-indigo-700 text-lg sm:text-2xl" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-indigo-700">Click to Explore</span>
                </div>
              )}

              {/* Premium Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex flex-col items-center justify-center transition-all duration-500 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="text-center px-4 sm:px-6">
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide uppercase drop-shadow-md"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Exclusive Menswear
                  </h2>
                  <p
                    className="text-gray-200 text-base sm:text-lg md:text-xl mt-2 sm:mt-3 max-w-xs font-light leading-relaxed drop-shadow-sm"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    Discover Timeless Luxury and Unmatched Style
                  </p>
                  <button
                    className="mt-4 sm:mt-6 px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full font-medium flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transition-all"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <span>Shop Now</span>
                    <FaArrowRight className="ml-1 sm:ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Info Section */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2 border-gray-100">
                Exclusive Benefits
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Curate your inventory with our flexible ordering system. Purchase only the sizes you need, maintaining optimal stock levels while offering premium selections to your clientele.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2 border-gray-100">
                Minimum Order ₹2000
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Nationwide delivery with premium packaging. Our wholesale platform provides retailers with luxury products at competitive prices, ensuring your boutique stands out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenPage;
