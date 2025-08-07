import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Video, TrendingUp, Smartphone, Menu, X } from "lucide-react";
import logo from "../../assets/logo1.png";
import Coursel from "../landing/Coursel";

const featuresData = [
  {
    icon: <TrendingUp className="w-8 h-8 text-coral-500" />,
    title: "Buy stocks for your shops/buisness easily .",
    content: "",
    bg: "bg-amber-100",
  },
  {
    icon: <Video className="w-8 h-8 text-rose-gold-500" />,
    title: "Great wholesale prices and offers.",
    content: "",
    bg: "bg-amber-100",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-taupe-500" />,
    title: "Quick doorstep delivery.",
    content: "",
    bg: "bg-amber-100",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-taupe-500" />,
    title: "Empowering small businesses across bharat.",
    content: "",
    bg: "bg-amber-100",
  },
];

const FeatureCard = ({ icon, title, content, bg }) => (
  <div className={`p-6 lg:p-8 rounded-2xl hover:shadow-md transition-transform duration-300 transform hover:-translate-y-1 ${bg}`}>
    <div className="w-14 h-14 flex items-center justify-center mb-5">{icon}</div>
    <h3 className="text-xl md:text-2xl font-semibold text-taupe-900 mb-3">{title}</h3>
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
      <nav className="lg:hidden fixed w-full top-0 bg-white shadow-lg z-50">
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
            <Link to="/login" className="block px-4 py-3 text-taupe-900 hover:bg-taupe-100 rounded-lg text-lg">
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
      <nav className="hidden lg:block fixed w-full top-0 bg-white shadow-lg z-50">
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
            {/* First h1 - now properly responsive */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-gray-600 mb-3 sm:mb-4 md:mb-5 lg:mb-6 tracking-tight">
              MANUFACTURER TO RETAILER
            </h1>
            {/* Second h1 - now properly responsive */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-taupe-900 mb-4 sm:mb-5 md:mb-6 lg:mb-7 tracking-tight leading-tight">
              {heroText}
            </h1>
          </div>
          <p className="text-base xs:text-lg sm:text-xl md:text-xl lg:text-2xl text-taupe-600 mb-6 sm:mb-8 lg:mb-10 max-w-3xl mx-auto">
            {heroSubtitle}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 sm:gap-3 bg-coral-500 text-ivory-50 px-5 py-2 sm:px-6 sm:py-3 md:px-7 md:py-3 lg:px-8 lg:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold hover:bg-coral-600 transition-all duration-300 shadow-lg bg-amber-200"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 " />
            Shop Now
          </Link>
        </div>
      </section>

      
      <Coursel/>


      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 ">
          {featuresData.map((feature, index) => (
            <FeatureCard className="" key={index} {...feature}  />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 text-center bg-rose-gold-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-5xl font-bold text-taupe-900 mb-4 sm:mb-5 lg:mb-6 tracking-tight">
            Elevate Your Wardrobe
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-taupe-600 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto">
            Join now for exclusive access to curated fashion and special offers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6">
            <Link
              to="/register"
              className="px-5 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-coral-500 text-ivory-50 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:bg-coral-600 transition-all duration-300 shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/categories"
              className="px-5 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 border-2 border-taupe-300 text-taupe-700 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:border-coral-500 hover:text-coral-500 transition-all duration-300"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-taupe-900 py-6 sm:py-8 text-center text-ivory-50 text-sm sm:text-base">
        ©2025 wholesalebaba.online All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
