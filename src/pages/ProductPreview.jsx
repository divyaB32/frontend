import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductPreview.css";
import Visualize from "./visualize";

export default function ProductPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [showVisualize, setShowVisualize] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setActiveImage(
          data.previewImages?.[0]
            ? `http://localhost:5000${data.previewImages[0]}`
            : `http://localhost:5000${data.tileImage}`
        );
      });

    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  }, [id]);

  if (!product) return <div className="preview-loading">Loading…</div>;

  const getRandomProducts = () => {
    const filtered = allProducts.filter((p) => p._id !== product._id);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  };

  const randomProducts = getRandomProducts();

  return (
    <section className="preview-page">
      <div className="preview-top">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <button className="visualize-btn" onClick={() => setShowVisualize(true)}>
          Visualize
        </button>
      </div>

      <div className="preview-layout">
        <div className="preview-left">
          <div className="image-frame">
            <div className="thumb-column">
              {(product.previewImages || []).map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000${img}`}
                  alt=""
                  className={activeImage === `http://localhost:5000${img}` ? "active" : ""}
                  onClick={() =>
                    setActiveImage(`http://localhost:5000${img}`)
                  }
                />
              ))}
            </div>

            <div className="main-image-box">
              <img src={activeImage} alt={product.name} />
            </div>
          </div>
        </div>

        <div className="preview-right">
          <span className="tile-series">{product.series}</span>
          <h1 className="tile-name">{product.name}</h1>

          <p className="tile-desc">
            Crafted with precision and elegance, this surface brings refined
            aesthetics and timeless beauty to contemporary interiors.
          </p>

          <button className="contact-btn" onClick={() => navigate("/contact")}>
            Contact Showroom
          </button>
        </div>
      </div>

      {randomProducts.length > 0 && (
        <div className="related-section">
          <h3>You may also like</h3>

          <div className="related-grid">
            {randomProducts.map((item) => (
              <div
                key={item._id}
                className="related-card"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="related-image">
                  <img
                    src={`http://localhost:5000${item.tileImage}`}
                    alt={item.name}
                  />
                </div>
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Visualize
        open={showVisualize}
        onClose={() => setShowVisualize(false)}
        product={product}
      />
    </section>
  );
}
