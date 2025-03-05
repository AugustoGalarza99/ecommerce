import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./Carousel.css";

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      const querySnapshot = await getDocs(collection(db, "banners"));
      const bannerData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by order field
      const sortedBanners = bannerData.sort((a, b) => a.order - b.order);
      setSlides(sortedBanners);
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Optional: Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return <div className="carousel">Loading...</div>;
  }

  return (
    <div className="carousel">
      <div
        className="carousel-slide"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="slide">
            <img src={slide.image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button className="carousel-button prev" onClick={prevSlide}>
            &#8249;
          </button>
          <button className="carousel-button next" onClick={nextSlide}>
            &#8250;
          </button>
        </>
      )}
    </div>
  );
}

export default Carousel;