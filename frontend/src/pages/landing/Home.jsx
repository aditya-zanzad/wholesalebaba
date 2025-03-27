import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Video, TrendingUp, Smartphone, Menu, X } from "lucide-react";
import logo from "../../assets/logo1.png";

const featuresData = [
  {
    icon: <TrendingUp className="w-8 h-8 text-coral-500" />,
    title: "Trend Discovery",
    content: "Stay ahead with daily video reels showcasing the latest styles.",
    bg: "bg-ivory-50",
  },
  {
    icon: <Video className="w-8 h-8 text-rose-gold-500" />,
    title: "Immersive Shopping",
    content: "Shop effortlessly within stunning video experiences.",
    bg: "bg-rose-gold-50",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-taupe-500" />,
    title: "Mobile First",
    content: "Designed for seamless swiping on any device.",
    bg: "bg-taupe-50",
  },
];

const FeatureCard = ({ icon, title, content, bg }) => (
  <div className={`p-6 lg:p-8 rounded-2xl hover:shadow-md transition-transform duration-300 transform hover:-translate-y-1 ${bg}`}>
    <div className="w-14 h-14 flex items-center justify-center mb-5">{icon}</div>
    <h3 className="text-2xl font-semibold text-taupe-900 mb-3">{title}</h3>
    <p className="text-taupe-600 text-base">{content}</p>
  </div>
);

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroText, setHeroText] = useState("Loading...");
  const [heroSubtitle, setHeroSubtitle] = useState("Loading...");

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_URL;
        console.log(backend);
        const response = await fetch(`${backend}/api/home/data`);
        const data = await response.json();
        console.log(data);

        if (data.success && data.hometext) {
          setHeroText(data.hometext.title);
          setHeroSubtitle(data.hometext.subtitle);
        } else {
          throw new Error("No valid data found");
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
        setHeroText("Redefine Your Style");
        setHeroSubtitle("Discover fashion like never before with video-powered shopping");
      }
    };
    fetchHeroData();
  }, []);

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed w-full top-0 bg-taupe-900 shadow-lg z-50">
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} className="h-12" alt="FashionReels Logo" />
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-ivory-50">
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="absolute w-full bg-white py-6 px-4 space-y-4 animate-slide-down">
            <Link to="/login" className="block px-4 py-3 text-ivory-50 hover:bg-taupe-800 rounded-lg text-lg">
              Login
            </Link>
            <Link
              to="/register"
              className="block px-4 py-3 bg-coral-500 text-ivory-50 rounded-lg font-medium hover:bg-coral-600 transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed w-full top-0 bg-taupe-900 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} className="h-14" alt="FashionReels Logo" />
          </div>
          <div className="flex gap-8">
            <Link to="/login" className="px-6 py-3 text-ivory-50 text-lg font-medium hover:text-rose-gold-400 transition-all">
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-coral-500 text-ivory-50 rounded-lg text-lg font-medium hover:bg-coral-600 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 lg:pt-40 pb-16 lg:pb-24 px-4 lg:px-6 text-center bg-gradient-to-b from-taupe-50 to-ivory-50">
        <div className="max-w-5xl mx-auto overflow-hidden">
        <div>
    {/* First h1 with fade-in and slide-up animation */}
    <h1 className="text-3xl lg:text-6xl font-extrabold text-gray-500 mb-6 tracking-wide whitespace-nowrap animate-fade-slide-up">
      MANUFACTURER TO RETAILER
    </h1>
    {/* Second h1 with typewriter animation */}
    <h1 className="text-4xl lg:text-7xl font-bold text-taupe-900 mb-6 tracking-wide whitespace-nowrap animate-typewriter">
      {heroText}
    </h1>

    {/* Inline CSS for custom animations */}
    <style>
      {`
        /* Fade-in and slide-up animation */
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 1.5s ease-out forwards;
        }

        /* Typewriter animation */
        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .animate-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 3s steps(20, end) forwards;
        }
      `}
    </style>
  </div>
          <p className="text-xl lg:text-2xl text-taupe-600 mb-10 max-w-3xl mx-auto animate-marquee whitespace-nowrap">
            {heroSubtitle}
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-amber-100 text-ivory-50 px-8 py-4 rounded-full text-lg font-semibold hover:bg-coral-600 transition-all duration-300 shadow-lg"
          >
            <ShoppingBag className="w-6 h-6" />
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-ivory-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 text-center bg-rose-gold-50">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-taupe-900 mb-6 tracking-wide">
            Elevate Your Wardrobe
          </h2>
          <p className="text-lg lg:text-xl text-taupe-600 mb-10">
            Join now for exclusive access to curated fashion and special offers.
          </p>
          <div className="flex flex-col lg:flex-row justify-center gap-6">
            <Link
              to="/register"
              className="px-8 py-4 bg-coral-500 text-ivory-50 rounded-full font-semibold hover:bg-coral-600 transition-all duration-300 shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/categories"
              className="px-8 py-4 border-2 border-taupe-300 text-taupe-700 rounded-full font-semibold hover:border-coral-500 hover:text-coral-500 transition-all duration-300"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-taupe-900 py-8 text-center text-ivory-50">
        © 2025 FashionReels. All rights reserved.
      </footer>

      {/* Inline CSS for Marquee Animation */}
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-marquee {
            animation: marquee 10s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Home;