import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeCTA.css";

const HomeCTA = () => {
  const navigate = useNavigate();
  const ctaRef = useRef(null);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlink(true);
        }
      },
      { threshold: 0.4 }
    );

    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="home-cta" ref={ctaRef}>
      <h2>Transform Your Space Today</h2>

      <p>
        Visit our showroom to experience the quality and elegance of our
        premium tile collection. Our experts are ready to help you find
        the perfect tiles for your project.
      </p>

      <button
        className={`cta-btn ${blink ? "blink" : ""}`}
        onClick={() => navigate("/contact")}
      >
        Contact Us →
      </button>
    </section>
  );
};

export default HomeCTA;
