import { useState, useRef } from "react";
import "./MatchTiles.css";

const BASE_URL = "http://localhost:5000";

export default function MatchTiles() {
  const [tiles, setTiles] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleUpload = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);

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
  };

  return (
    <section className="match-page">
      {/* HEADER */}
      <div className="match-header">
        <h1>Find Similar Tiles</h1>
        <p>
          Upload a tile or room image and discover visually similar tiles from
          our collection.
        </p>
      </div>

      {/* UPLOAD */}
      <div
        className="upload-box"
        onClick={() => inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleUpload(e.target.files[0])}
        />

        {!preview && (
          <>
            <div className="upload-icon">📷</div>
            <h3>Upload Reference Image</h3>
            <span>JPG / PNG / WEBP</span>
          </>
        )}

        {preview && (
          <img src={preview} alt="Preview" className="preview-img" />
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="loading">
          <span className="spinner" />
          <p>Analysing image…</p>
        </div>
      )}

      {/* RESULTS */}
      {!loading && tiles.length > 0 && (
        <div className="results">
          <div className="results-header">
            <h2>Matching Tiles</h2>
            <span>{tiles.length} results</span>
          </div>

          <div className="tiles-grid">
            {tiles.map((tile) => (
              <div key={tile._id} className="tile-card">
                <img
                  src={`${BASE_URL}${tile.tileImage}`}
                  alt={tile.name}
                />
                <div className="tile-info">
                  <h4>{tile.name}</h4>
                  <p>{tile.series}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}