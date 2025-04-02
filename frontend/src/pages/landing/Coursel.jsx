import React, { useEffect, useState, useRef } from "react";
import coursel1 from "../../assets/coursel1.jpg";
import coursel2 from "../../assets/coursel2.jpg";
import coursel3 from "../../assets/coursel3.jpg";
const images = [
  coursel1,
  coursel2,
  coursel3,
  coursel1,
  coursel2,
  coursel3,
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);
  const speed = 2000; // Increase speed (milliseconds)

  useEffect(() => {
    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    timeoutRef.current = setInterval(nextSlide, speed);

    return () => clearInterval(timeoutRef.current);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg">
      {/* Centered Bold Text */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1 className="text-white text-3xl md:text-5xl font-bold bg-black/20 px-6 py-3 rounded-lg">
          India's Largest eB2B Platform for Businesses & Shop-owners
        </h1>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative h-96 md:h-96 overflow-hidden rounded-lg">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`absolute w-full h-[600px] object-cover transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
     

      {/* Indicators */}
      
    </div>
  );
};

export default Carousel;
