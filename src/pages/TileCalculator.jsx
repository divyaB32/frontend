import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import "./TileCalculator.css";

export default function TileCalculator() {
  const [tileLength, setTileLength] = useState(60);
  const [tileWidth, setTileWidth] = useState(60);
  const [areaMode, setAreaMode] = useState("dimensions");
  const [areaLength, setAreaLength] = useState(5);
  const [areaWidth, setAreaWidth] = useState(4);
  const [totalArea, setTotalArea] = useState("");
  const [gap, setGap] = useState(0.3);
  const [boxSize, setBoxSize] = useState(12);
  const [price, setPrice] = useState("");
  const [wastage, setWastage] = useState(10);
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState(null);

  const calculate = () => {
    const tileL = tileLength + gap;
    const tileW = tileWidth + gap;

    let areaSqm =
      areaMode === "dimensions" ? areaLength * areaWidth : parseFloat(totalArea) || 0;

    const tileAreaSqm = (tileL / 100) * (tileW / 100);
    const baseTiles = Math.ceil(areaSqm / tileAreaSqm);
    const withWastage = Math.ceil(baseTiles * (1 + wastage / 100));
    const boxesNeeded = Math.ceil(withWastage / boxSize);
    const totalCost = price ? withWastage * parseFloat(price) : null;

    setResult({ areaSqm, baseTiles, tilesNeeded: withWastage, boxesNeeded, totalCost });
    setActiveStep(null);
  };

  const clearAll = () => {
    setTileLength(60);
    setTileWidth(60);
    setAreaMode("dimensions");
    setAreaLength(5);
    setAreaWidth(4);
    setTotalArea("");
    setGap(0.3);
    setBoxSize(12);
    setPrice("");
    setWastage(10);
    setResult(null);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210;
    const margin = 20;
    let y = 0;

    // ── Header band ──
    doc.setFillColor(139, 115, 85);
    doc.rect(0, 0, W, 42, "F");

    // Logo / Brand name
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 248, 235);
    doc.text("Krishna Ceramics", margin, 18);

    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(240, 228, 210);
    doc.text("2/819, Mahalaxmi Nagar, Tiruppur Main Road, Palladam – 641 664, Tamil Nadu, India", margin, 27);
    doc.text("+91 98436 20156   |   krishnaceramics@yahoo.in", margin, 33);

    // Document title (right)
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.setTextColor(255, 248, 235);
    doc.text("TILE ESTIMATE", W - margin, 18, { align: "right" });
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(240, 228, 210);
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    doc.text(today, W - margin, 27, { align: "right" });

    y = 56;

    // ── Section: Inputs ──
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(139, 115, 85);
    doc.text("INPUT SUMMARY", margin, y);
    doc.setDrawColor(200, 185, 154);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 2, W - margin, y + 2);
    y += 10;

    const inputRows = [
      ["Tile Size", `${tileLength} cm × ${tileWidth} cm`],
      ["Grout Gap", `${gap} cm`],
      areaMode === "dimensions"
        ? ["Area Dimensions", `${areaLength} m × ${areaWidth} m`]
        : ["Total Area", `${result.areaSqm} sq.m`],
      ["Wastage Factor", `${wastage}%`],
      ["Tiles per Box", `${boxSize}`],
      ...(price ? [["Price per Tile", `₹ ${parseFloat(price).toLocaleString("en-IN")}`]] : []),
    ];

    doc.setFontSize(10);
    inputRows.forEach(([label, value], i) => {
      if (i % 2 === 0) {
        doc.setFillColor(250, 247, 242);
        doc.rect(margin, y - 4, W - margin * 2, 8, "F");
      }
      doc.setFont("times", "normal");
      doc.setTextColor(107, 97, 88);
      doc.text(label, margin + 4, y);
      doc.setFont("times", "bold");
      doc.setTextColor(44, 41, 36);
      doc.text(String(value), W - margin - 4, y, { align: "right" });
      y += 9;
    });

    y += 6;

    // ── Section: Results ──
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(139, 115, 85);
    doc.text("ESTIMATE RESULTS", margin, y);
    doc.line(margin, y + 2, W - margin, y + 2);
    y += 10;

    const resultRows = [
      ["Total Floor Area", `${result.areaSqm.toFixed(2)} sq.m`],
      ["Base Tiles Required", `${result.baseTiles} tiles`],
      [`Tiles with ${wastage}% Wastage`, `${result.tilesNeeded} tiles`],
      ["Boxes Required", `${result.boxesNeeded} boxes`],
      ...(result.totalCost !== null
        ? [["Estimated Cost", `₹ ${result.totalCost.toLocaleString("en-IN")}`]]
        : []),
    ];

    doc.setFontSize(11);
    resultRows.forEach(([label, value], i) => {
      const isLast = i === resultRows.length - 1 && result.totalCost !== null;
      if (isLast) {
        doc.setFillColor(139, 115, 85);
        doc.rect(margin, y - 5, W - margin * 2, 12, "F");
        doc.setFont("times", "bold");
        doc.setTextColor(255, 248, 235);
        doc.text(label, margin + 4, y + 2);
        doc.text(String(value), W - margin - 4, y + 2, { align: "right" });
        y += 14;
      } else {
        if (i % 2 === 0) {
          doc.setFillColor(250, 247, 242);
          doc.rect(margin, y - 5, W - margin * 2, 10, "F");
        }
        doc.setFont("times", "normal");
        doc.setTextColor(107, 97, 88);
        doc.text(label, margin + 4, y);
        doc.setFont("times", "bold");
        doc.setTextColor(44, 41, 36);
        doc.text(String(value), W - margin - 4, y, { align: "right" });
        y += 11;
      }
    });

    y += 10;

    // ── Note ──
    doc.setFillColor(245, 241, 234);
    doc.rect(margin, y, W - margin * 2, 18, "F");
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(107, 97, 88);
    doc.text(
      "Note: This is an indicative estimate. Actual quantities may vary depending on tile layout,",
      margin + 4,
      y + 7
    );
    doc.text(
      "cutting pattern, and site conditions. Please consult our showroom for a precise quote.",
      margin + 4,
      y + 13
    );
    y += 26;

    // ── Footer ──
    doc.setFillColor(58, 53, 48);
    doc.rect(0, 277, W, 20, "F");
    doc.setFont("times", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(200, 185, 154);
    doc.text("Krishna Ceramics  |  +91 98436 20156  |  krishnaceramics@yahoo.in", W / 2, 289, { align: "center" });

    doc.save("Krishna_Ceramics_Tile_Estimate.pdf");
  };

  const steps = [
    { id: "tile", label: "01", title: "Tile Size", icon: "⬜" },
    { id: "area", label: "02", title: "Area to Cover", icon: "📐" },
    { id: "details", label: "03", title: "Details", icon: "⚙️" },
  ];

  return (
    <section className="calc-page">

      {/* ── HERO ── */}
      <div className="calc-hero">
        <p className="calc-eyebrow">Plan Your Project</p>
        <h1 className="calc-title">Tile Calculator</h1>
        <p className="calc-subtitle">
          Get an accurate estimate of tiles, boxes, and cost for your space.
        </p>
      </div>

      {/* ── STEP INDICATORS ── */}
      <div className="calc-steps">
        {steps.map((s, i) => (
          <div key={s.id} className="step-item">
            <div className={`step-dot ${activeStep === s.id ? "active" : ""}`}>
              <span>{s.label}</span>
            </div>
            <div className="step-label">{s.title}</div>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      {/* ── CALCULATOR CARD ── */}
      <div className="calc-card">

        {/* TILE SIZE */}
        <div className="calc-section" onClick={() => setActiveStep("tile")}>
          <div className="calc-section-head">
            <div className="section-num">01</div>
            <div>
              <h3>Tile Dimensions</h3>
              <p>Enter the size of a single tile</p>
            </div>
          </div>
          <div className="calc-fields-row">
            <div className="field-group">
              <label>Length</label>
              <div className="input-wrap">
                <input type="number" value={tileLength} onChange={(e) => setTileLength(+e.target.value)} />
                <span className="input-unit">cm</span>
              </div>
            </div>
            <div className="field-divider">×</div>
            <div className="field-group">
              <label>Width</label>
              <div className="input-wrap">
                <input type="number" value={tileWidth} onChange={(e) => setTileWidth(+e.target.value)} />
                <span className="input-unit">cm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="calc-divider" />

        {/* AREA */}
        <div className="calc-section" onClick={() => setActiveStep("area")}>
          <div className="calc-section-head">
            <div className="section-num">02</div>
            <div>
              <h3>Area to Cover</h3>
              <p>Enter floor or wall dimensions</p>
            </div>
          </div>

          <div className="radio-toggle">
            <button
              className={areaMode === "dimensions" ? "toggle-active" : ""}
              onClick={() => setAreaMode("dimensions")}
            >
              By Dimensions
            </button>
            <button
              className={areaMode === "area" ? "toggle-active" : ""}
              onClick={() => setAreaMode("area")}
            >
              Total Area
            </button>
          </div>

          {areaMode === "dimensions" ? (
            <div className="calc-fields-row">
              <div className="field-group">
                <label>Length</label>
                <div className="input-wrap">
                  <input type="number" value={areaLength} onChange={(e) => setAreaLength(+e.target.value)} />
                  <span className="input-unit">m</span>
                </div>
              </div>
              <div className="field-divider">×</div>
              <div className="field-group">
                <label>Width</label>
                <div className="input-wrap">
                  <input type="number" value={areaWidth} onChange={(e) => setAreaWidth(+e.target.value)} />
                  <span className="input-unit">m</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="calc-fields-row">
              <div className="field-group">
                <label>Total Area</label>
                <div className="input-wrap">
                  <input type="number" value={totalArea} placeholder="0" onChange={(e) => setTotalArea(e.target.value)} />
                  <span className="input-unit">sq.m</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="calc-divider" />

        {/* DETAILS */}
        <div className="calc-section" onClick={() => setActiveStep("details")}>
          <div className="calc-section-head">
            <div className="section-num">03</div>
            <div>
              <h3>Additional Details</h3>
              <p>Grout gap, wastage, pricing</p>
            </div>
          </div>

          <div className="details-grid">
            <div className="field-group">
              <label>Grout Gap</label>
              <div className="input-wrap">
                <input type="number" value={gap} step="0.1" onChange={(e) => setGap(+e.target.value)} />
                <span className="input-unit">cm</span>
              </div>
            </div>

            <div className="field-group">
              <label>Wastage %</label>
              <div className="input-wrap">
                <input type="number" value={wastage} onChange={(e) => setWastage(+e.target.value)} />
                <span className="input-unit">%</span>
              </div>
              <span className="field-hint">Recommended: 10%</span>
            </div>

            <div className="field-group">
              <label>Tiles per Box</label>
              <div className="input-wrap">
                <input type="number" value={boxSize} onChange={(e) => setBoxSize(+e.target.value)} />
                <span className="input-unit">pcs</span>
              </div>
            </div>

            <div className="field-group">
              <label>Price per Tile</label>
              <div className="input-wrap">
                <span className="input-prefix">₹</span>
                <input type="number" value={price} placeholder="Optional" onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="calc-actions">
          <button className="btn-calculate" onClick={calculate}>
            <span>Calculate</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button className="btn-clear" onClick={clearAll}>Clear All</button>
        </div>
      </div>

      {/* ── RESULTS ── */}
      {result && (
        <div className="results-card">
          <div className="results-card-header">
            <div>
              <h2>Estimate Summary</h2>
              <p>Based on your inputs</p>
            </div>
            <div className="results-brand-badge">Krishna Ceramics</div>
          </div>

          <div className="results-grid">
            <div className="result-item">
              <span className="result-icon">📏</span>
              <div>
                <p className="result-label">Total Area</p>
                <p className="result-value">{result.areaSqm.toFixed(2)} <span>sq.m</span></p>
              </div>
            </div>

            <div className="result-item">
              <span className="result-icon">🟫</span>
              <div>
                <p className="result-label">Tiles Needed</p>
                <p className="result-value">{result.tilesNeeded} <span>tiles</span></p>
              </div>
            </div>

            <div className="result-item">
              <span className="result-icon">📦</span>
              <div>
                <p className="result-label">Boxes Required</p>
                <p className="result-value">{result.boxesNeeded} <span>boxes</span></p>
              </div>
            </div>

            {result.totalCost !== null && (
              <div className="result-item result-highlight">
                <span className="result-icon">💰</span>
                <div>
                  <p className="result-label">Estimated Cost</p>
                  <p className="result-value">₹ {result.totalCost.toLocaleString("en-IN")}</p>
                </div>
              </div>
            )}
          </div>

          <div className="results-note">
            ✦ Includes {wastage}% wastage allowance · {result.baseTiles} base tiles + {result.tilesNeeded - result.baseTiles} extra
          </div>

          <button className="btn-download" onClick={downloadPDF}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Download PDF Estimate
          </button>
        </div>
      )}
    </section>
  );
}