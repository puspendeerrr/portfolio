import React, { useEffect, useState, useCallback } from "react";
import BASE_URL from "../../../../api/config";
import "./HeroSlideshow.css";

interface Slide {
  _id: string;
  imageUrl: string;
  order: number;
}

export const HeroSlideshow: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/hero-slides`);

        if (!response.ok) {
          throw new Error("Failed to fetch slides");
        }

        const data = await response.json();
        const sortedSlides = data.data.sort((a: Slide, b: Slide) => a.order - b.order);
        setSlides(sortedSlides);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error fetching hero slides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Handle image load
  const handleImageLoad = useCallback((imageUrl: string) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));
  }, []);

  // Handle slide dot click
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="hero-slideshow hero-slideshow--skeleton">
        <div className="hero-slideshow-skeleton-pulse" />
      </div>
    );
  }

  // Error state
  if (error || slides.length === 0) {
    return (
      <div className="hero-slideshow hero-slideshow--empty">
        <div className="hero-slideshow-empty-content">
          <div className="hero-slideshow-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="hero-slideshow-empty-text">
            {error ? "Unable to load gallery" : "Gallery coming soon"}
          </p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[activeIndex];

  return (
    <div className="hero-slideshow">
      {/* Slideshow container */}
      <div className="hero-slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`hero-slideshow-slide ${
              index === activeIndex ? "hero-slideshow-slide--active" : ""
            }`}
            style={{
              opacity: index === activeIndex ? 1 : 0,
            }}
          >
            {/* Hidden image for preloading */}
            <img
              src={slide.imageUrl}
              alt={`Hero slide ${index + 1}`}
              className="hero-slideshow-image"
              loading={index === activeIndex ? "eager" : "lazy"}
              onLoad={() => handleImageLoad(slide.imageUrl)}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="hero-slideshow-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-slideshow-dot ${
              index === activeIndex ? "hero-slideshow-dot--active" : ""
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlideshow;
