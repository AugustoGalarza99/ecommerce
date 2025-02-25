import React, { useState } from "react";
import "./Carousel.css";

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "https://via.placeholder.com/1200x400/6B48FF/FFFFFF?text=Banner+1",
      title: "¡VUELTA A CLASES SHIPIN!",
      subtitle: "MEGA OFERTAS",
      description: "Envíos Turbo en el día o 24hs (Ciudad de Córdoba)"
    },
    {
      image: "https://via.placeholder.com/1200x400/FF6B6B/FFFFFF?text=Banner+2",
      title: "TECNOLOGÍA AL ALCANCE",
      subtitle: "DESCUENTOS IMPERDIBLES",
      description: "Envíos gratis a todo el país"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="carousel">
      <div className="carousel-slide" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            <img src={slide.image} alt={`Slide ${index + 1}`} />
            <div className="slide-content">
              <h1>{slide.title}</h1>
              <h2>{slide.subtitle}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-button prev" onClick={prevSlide}>&lt;</button>
      <button className="carousel-button next" onClick={nextSlide}>&gt;</button>
    </div>
  );
}

export default Carousel;