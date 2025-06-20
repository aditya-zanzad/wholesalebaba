
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import menImage from "../../assets/man.png";
import { motion, AnimatePresence } from "framer-motion";
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
      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", damping: 10 }}
              className="text-white text-lg sm:text-2xl font-light flex items-center"
            >
              <motion.span
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <FaArrowRight className="mr-2 sm:mr-3" />
              </motion.span>
              Entering Collection...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl w-full mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800 text-center mb-6 sm:mb-8 tracking-tight"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-gray-900 to-black">
            Men's Premium Collection
          </span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Premium Image Card */}
          <motion.div
            className="relative group cursor-pointer"
            onClick={handleImageClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200/50">
              <motion.img
                src={menImage}
                alt="Men's Premium Collection"
                className="w-full h-[300px] sm:h-[400px] md:h-[550px] object-cover object-top"
                animate={{
                  scale: isHovered ? 1.08 : 1,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              {/* Click Prompt */}
              {showClickPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1.5 }}
                  className="absolute top-4 right-4 bg-white/90 rounded-full p-2 sm:p-3 shadow-xl backdrop-blur-sm flex items-center space-x-1 sm:space-x-2"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }}
                  >
                    <FaHandPointer className="text-indigo-700 text-lg sm:text-2xl" />
                  </motion.div>
                  <span className="text-xs sm:text-sm font-medium text-indigo-700">Click to Explore</span>
                </motion.div>
              )}

              {/* Premium Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={isHovered ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
                  className="text-center px-4 sm:px-6"
                >
                  <motion.h2
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide uppercase drop-shadow-md"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Exclusive Menswear
                  </motion.h2>
                  <motion.p
                    className="text-gray-200 text-base sm:text-lg md:text-xl mt-2 sm:mt-3 max-w-xs font-light leading-relaxed drop-shadow-sm"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    Discover Timeless Luxury and Unmatched Style
                  </motion.p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 sm:mt-6 px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full font-medium flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transition-all"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <span>Shop Now</span>
                    <FaArrowRight className="ml-1 sm:ml-2" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Shimmer Effect */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{ opacity: 0.4, x: "100%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                />
              )}
            </div>
          </motion.div>

          {/* Premium Info Section */}
          <div className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2 border-gray-100">
                Exclusive Benefits
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Curate your inventory with our flexible ordering system. Purchase only the sizes you need, maintaining optimal stock levels while offering premium selections to your clientele.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2 border-gray-100">
                Minimum Order ₹2000
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Nationwide delivery with premium packaging. Our wholesale platform provides retailers with luxury products at competitive prices, ensuring your boutique stands out.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenPage;
