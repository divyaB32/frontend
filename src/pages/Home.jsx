import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeCTA from "../components/HomeCTA";
import "./Home.css";

const BASE_URL = "http://localhost:5000";

// unified image resolver
const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
};

const Home = () => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        // pick random 10 products
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setTrendingProducts(shuffled.slice(0, 10));
      })
      .catch((err) => console.error("Trending fetch error:", err));
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-tag">PREMIUM CERAMIC TILES</span>

            <h1 className="hero-title">
              Elegant Designs <br />
              for Modern <br />
              Spaces
            </h1>

            <p className="hero-description">
              Explore our curated range of ceramic tiles crafted to
              enhance living rooms, kitchens, and bathrooms with
              timeless style.
            </p>

            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate("/collection")}
              >
                Explore Collection →
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/contact")}
              >
                Visit Showroom
              </button>
            </div>
          </div>

          <div className="hero-image">
            <img src="/hero-tile.png" alt="Ceramic Tile Design" />
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="features">
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon">★</div>
            <div className="feature-content">
              <h3>Premium Quality</h3>
              <p>600×1200mm glazed vitrified tiles with 9mm thickness</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🛡</div>
            <div className="feature-content">
              <h3>Durable Finish</h3>
              <p>Resistant to stains, scratches, and thermal shocks</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🎨</div>
            <div className="feature-content">
              <h3>Authentic Design</h3>
              <p>Inspired by nature with masterful artistic patterns</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRENDING PRODUCTS ================= */}
      <section className="trending-section">
        <div className="trending-header">
          <span className="trending-tag">DISCOVER OUR BESTSELLERS</span>
          <h2 className="trending-title">Trending Products</h2>
          <p className="trending-subtitle">
            Explore the most popular ceramic tiles chosen by designers and homeowners alike
          </p>
        </div>

        <div className="trending-slider">
          <div className="trending-track">
            {[...trendingProducts, ...trendingProducts].map((product, i) => (
              <div
                key={`${product._id}-${i}`}
                className="trending-card"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="trending-card-image">
                  <img
                    src={getImageUrl(product.tileImage)}
                    alt={product.name}
                  />
                </div>
                <div className="trending-card-content">
                  <h3 className="trending-card-name">{product.name}</h3>
                  <p className="trending-card-details">Ceramic Tile</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <HomeCTA />
    </>
  );
};

export default Home;
