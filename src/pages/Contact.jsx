import { useEffect, useState } from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import "./Contact.css";

const BASE_URL = "http://localhost:5000";

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
};

const SERIES_LIST = [
  "Fabula Series",
  "Endless Surface",
  "Endless Collection",
  "PGVT Series (Glossy)",
  "Matt Series",
  "Shine Finish",
  "Colorica Series (Glossy)",
  "Fabula Series Plain",
];

const Contact = () => {
  const [products, setProducts] = useState([]);
  const [activeSeries, setActiveSeries] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customImage, setCustomImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Products error:", err));
  }, []);

  const filteredProducts = products.filter(
    (product) => product.series === activeSeries
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("phone", formData.phone);
    form.append("message", formData.message);

    if (selectedProduct) {
      form.append("tileName", selectedProduct.name);
      form.append("tileImage", selectedProduct.tileImage);
    }

    if (customImage) {
      form.append("customImage", customImage);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        alert("Enquiry sent successfully");
        setFormData({ name: "", phone: "", message: "" });
        setActiveSeries("");
        setSelectedProduct(null);
        setCustomImage(null);
      } else {
        alert("Failed to send enquiry");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <section className="contact-page">

      {/* HEADER */}
      <div className="contact-header">
        <span className="contact-tag">Get In Touch</span>
        <h1>Product Enquiry</h1>
        <p>
          Browse our tile collections, select your favourite, and send us
          your enquiry — we'll get back to you within one business day.
        </p>
      </div>

      <div className="contact-container">

        {/* LEFT */}
        <div className="contact-form">
          <h3>Send Your Enquiry</h3>

          <label className="series-label">Select Tile Series</label>
          <select
            className="series-select"
            value={activeSeries}
            onChange={(e) => {
              setActiveSeries(e.target.value);
              setSelectedProduct(null);
            }}
          >
            <option value="">— Choose a series —</option>
            {SERIES_LIST.map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
          </select>

          {activeSeries && (
            <div className="tiles-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className={`tile-card ${
                    selectedProduct?._id === product._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={getImageUrl(product.tileImage)}
                    alt={product.name}
                  />
                  <p>{product.name}</p>
                </div>
              ))}
            </div>
          )}

          {selectedProduct && (
            <div className="selected-tile">
              <img
                src={getImageUrl(selectedProduct.tileImage)}
                alt={selectedProduct.name}
                className="tile-preview"
              />
              <div className="selected-tile-info">
                <div className="selected-tile-label">Selected Tile</div>
                <div className="selected-tile-name">
                  {selectedProduct.name}
                </div>
              </div>
            </div>
          )}

          <div className="upload-wrapper">
            <label className="upload-label">
              Or Upload Your Own Reference Image
            </label>
            <div className="upload-area">
              <span className="upload-icon">📎</span>
              <span>
                {customImage
                  ? customImage.name
                  : "Click to browse or drag & drop"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCustomImage(e.target.files[0])}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label>Your Name</label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="field-group">
              <label>Phone Number</label>
              <input
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="field-group">
              <label>Your Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <button type="submit">
              <Send size={15} /> Send Enquiry
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="contact-details">
          <h3>Contact Information</h3>

          <div className="detail-card">
            <div className="detail-item">
              <div className="icon">
                <Phone size={20} />
              </div>
              <div>
                <h4>Phone</h4>
                <p>+91 98436 20156</p>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-item">
              <div className="icon">
                <Mail size={20} />
              </div>
              <div>
                <h4>Email</h4>
                <p>krishnaceramics@yahoo.in</p>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-item">
              <div className="icon">
                <MapPin size={20} />
              </div>
              <div>
                <h4>Showroom Address</h4>
                <p>
                  2/819, Mahalaxmi Nagar,<br />
                  Tiruppur Main Road,<br />
                  Palladam – 641 664,<br />
                  Tamil Nadu, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="contact-map">
        <div className="contact-map-inner">
          <div className="map-pin">
            <MapPin size={24} />
          </div>
          <h4>Find Our Showroom</h4>
          <p>
            2/819, Mahalaxmi Nagar, Tiruppur Main Road,
            Palladam – 641 664, Tamil Nadu, India
          </p>
        </div>
      </div>

    </section>
  );
};

export default Contact;