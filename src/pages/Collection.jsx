import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Collection.css";

const BASE_URL = "http://localhost:5000";

// 🔴 IMPORTANT: single safe image resolver
const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
};

const Collection = () => {
  const [products, setProducts] = useState([]);

  // EXISTING STATES
  const [activeSeries, setActiveSeries] = useState("Fabula Series");
  const [activeCategory, setActiveCategory] = useState("");

  // ✅ NEW: SEARCH STATE
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  // EXISTING dropdown categories (UNCHANGED)
  const endlessCategories = [
    "Polished Surface",
    "HI Surface",
    "Marble Surface",
    "Porce Surface",
    "GHR Surface",
  ];

  // ✅ SEARCH + EXISTING FILTER LOGIC (SAFE)
  const filteredProducts = products.filter((product) => {
    // series/category logic (UNCHANGED)
    if (activeSeries === "Endless Surface") {
      if (!activeCategory) return false;
      if (
        product.series !== "Endless Surface" ||
        product.category !== activeCategory
      ) {
        return false;
      }
    } else {
      if (product.series !== activeSeries) return false;
    }

    // ✅ search filter
    if (!search) return true;

    const q = search.toLowerCase();
    return (
      product.name?.toLowerCase().includes(q) ||
      product.series?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q)
    );
  });

  return (
    <section className="collection-page">
      <div className="collection-header">
        <h1>Tile Collection</h1>

        <p>
          Explore our complete range of premium glazed vitrified tiles. Each
          design captures authentic artistry with graceful curves and
          enchanting color combinations.
        </p>

        {/* ✅ SEARCH BAR (NEW) */}
        <div className="collection-search">
          <input
            type="text"
            placeholder="Search tiles by name, series, or surface..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* SERIES TABS */}
        <div className="series-tabs scroll-x">
          {[
            "Fabula Series",
            "Endless Surface",
            "Endless Collection",
            "PGVT Series (Glossy)",
            "Matt Series",
            "Shine Finish",
            "Colorica Series (Glossy)",
            "Fabula Series Plain",
          ].map((series) => (
            <span
              key={series}
              className={`series-tab ${
                activeSeries === series ? "active" : ""
              }`}
              onClick={() => {
                setActiveSeries(series);
                setActiveCategory("");
              }}
            >
              {series.toUpperCase()}
            </span>
          ))}
        </div>

        {activeSeries === "Endless Surface" && (
          <div className="surface-dropdown">
            {endlessCategories.map((cat) => (
              <button
                key={cat}
                className={`surface-btn ${
                  activeCategory === cat ? "active" : ""
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-grid">
        {filteredProducts.length === 0 && (
          <p className="empty-text">No products found</p>
        )}

        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <div className="image-wrapper">
              <img
                src={getImageUrl(product.tileImage)}
                alt={product.name}
                className="main-img"
              />

              {product.hoverImage && (
                <img
                  src={getImageUrl(product.hoverImage)}
                  alt="preview"
                  className="hover-img"
                />
              )}
            </div>

            <h3>{product.name}</h3>

            <button
              className="details-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product._id}`);
              }}
            >
              Details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Collection;