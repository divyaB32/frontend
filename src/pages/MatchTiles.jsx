import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MatchTiles.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function MatchTiles() {
  const [tiles, setTiles] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setTiles([]);
    setSearched(false);

    const form = new FormData();
    form.append("image", file);

    try {
      const res = await fetch(`${BASE_URL}/api/match-tiles`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setTiles(data.matches || []);
    } catch (err) {
      console.error(err);
      setTiles([]);
    }

    setLoading(false);
    setSearched(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <section className="match-page">

      {/* ── HERO ── */}
      <div className="match-hero">
        <p className="match-hero-eyebrow">Visual AI Search</p>
        <h1 className="match-hero-title">Find Similar Tiles</h1>
        <p className="match-hero-sub">
          Upload a photo of any tile or room — our visual engine instantly surfaces
          the closest matches from our curated collection.
        </p>
      </div>

      {/* ── SEARCH ZONE ── */}
      <div className="match-search-zone">
        <div
          className={`search-drop-area ${dragOver ? "drag-active" : ""} ${preview ? "has-image" : ""}`}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleUpload(e.target.files[0])}
          />

          {!preview ? (
            <div className="drop-inner">
              {/* Decorative corner marks */}
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />

              <div className="drop-icon-wrap">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="23" stroke="#c8b99a" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <path d="M24 16v10M19 21l5-5 5 5" stroke="#b8935a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="16" y="30" width="16" height="2" rx="1" fill="#d4cec4"/>
                </svg>
              </div>

              <p className="drop-title">Drop your image here</p>
              <p className="drop-sub">or click to browse</p>
              <div className="drop-formats">
                <span>JPG</span><span>·</span><span>PNG</span><span>·</span><span>WEBP</span>
              </div>
            </div>
          ) : (
            <div className="drop-preview-wrap">
              <img src={preview} alt="Uploaded" className="drop-preview-img" />
              <div className="drop-preview-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                Click to change image
              </div>
            </div>
          )}
        </div>

        {/* Tips strip */}
        <div className="search-tips">
          <span className="tip-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8935a" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Close-up tile shot works best
          </span>
          <span className="tip-sep">·</span>
          <span className="tip-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8935a" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Good lighting, minimal shadows
          </span>
          <span className="tip-sep">·</span>
          <span className="tip-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8935a" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Flat lay or direct-face angle
          </span>
        </div>
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="match-loading">
          <div className="loading-ring">
            <div className="ring-spinner" />
          </div>
          <p className="loading-label">Scanning collection…</p>
        </div>
      )}

      {/* ── NO RESULTS ── */}
      {!loading && searched && tiles.length === 0 && (
        <div className="match-empty">
          <div className="empty-icon">✦</div>
          <h3>No matches found</h3>
          <p>Try a clearer or different tile image.</p>
        </div>
      )}

      {/* ── RESULTS ── */}
      {!loading && tiles.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <div className="results-header-left">
              <h2>Matching Tiles</h2>
              <p>Sorted by visual similarity</p>
            </div>
            <div className="results-count">{tiles.length} results</div>
          </div>

          <div className="tiles-grid">
            {tiles.map((tile) => (
              <div
                key={tile._id}
                className="tile-card"
                onClick={() => navigate(`/product/${tile._id}`)}
              >
                <div className="tile-img-wrap">
                  <img src={`${BASE_URL}${tile.tileImage}`} alt={tile.name} />
                  <div className="tile-overlay">
                    <span>View Product →</span>
                  </div>
                </div>
                <div className="tile-info">
                  <h4>{tile.name}</h4>
                  <p className="tile-series">{tile.series}</p>
                  <div className="tile-btns">
                    <button className="tbtn-primary" onClick={(e) => { e.stopPropagation(); navigate(`/product/${tile._id}`); }}>
                      View Tile
                    </button>
                    <button className="tbtn-outline" onClick={(e) => { e.stopPropagation(); navigate("/contact"); }}>
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}