import React from "react";
import { useNavigate } from "react-router-dom";
import menImage from "../../assets/man.png"; // Ensure this path is correct

const MenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 animate-fade-in">
          Men's Fashion Collection
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Image Card */}
          <div
            className="relative group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
            onClick={() => navigate("/categories")}
          >
            <div className="relative overflow-hidden rounded-xl shadow-xl">
              <img
                src={menImage}
                alt="Men's Category"
                className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
                  Explore Men's Style
                </h2>
                <p className="text-gray-200 text-sm md:text-base px-4 text-center">
                  Discover the latest trends in men's fashion
                </p>
                <button className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                New Arrivals
              </h3>
              <p className="text-gray-600">
                Check out our latest collection of men's apparel, featuring modern designs and premium quality.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Seasonal Trends
              </h3>
              <p className="text-gray-600">
                From casual wear to formal attire, find the perfect outfit for every occasion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this CSS in your global stylesheet or use a CSS-in-JS solution
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  @media (max-width: 768px) {
    .animate-fade-in-up {
      animation-delay: 0.2s;
    }
  }
`;

export default MenPage;