import { useState } from "react";
import "./visualize.css";

/* ===============================
   BACKEND BASE URL
   Trim trailing slash to avoid double-slash URLs
================================ */
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/* ===============================
   ROOM CONFIG
   Defined as a function so API_BASE is always resolved correctly
================================ */
const getRooms = () => [
  {
    id: "small",
    label: "Small Room",
    base: `${API_BASE}/rooms/living/small_room.jpg`,
    floorMask: `${API_BASE}/mask/Floor/small_room_floor_mask.png`,
    wallMask: `${API_BASE}/mask/Wall/small_room_wall.png`,
  },
  {
    id: "medium",
    label: "Medium Room",
    base: `${API_BASE}/rooms/living/medium_room.jpg`,
    floorMask: `${API_BASE}/mask/Floor/medium_room_floor_mask.png`,
    wallMask: `${API_BASE}/mask/Wall/medium_room_wall.png`,
  },
  {
    id: "large",
    label: "Large Room",
    base: `${API_BASE}/rooms/living/large_room.jpg`,
    floorMask: `${API_BASE}/mask/Floor/large_room_floor_mask.png`,
    wallMask: `${API_BASE}/mask/Wall/large_room_wall.png`,
  },
  {
    id: "extra",
    label: "Extra Large Room",
    base: `${API_BASE}/rooms/living/extra_large_room.jpg`,
    floorMask: `${API_BASE}/mask/Floor/extra_large_room_floor_mask.png`,
    wallMask: `${API_BASE}/mask/Wall/extra_large_room_wall.png`,
  },
];

export default function Visualize({ open, onClose, product }) {
  const ROOMS = getRooms();

  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
  const [surface, setSurface] = useState("floor");

  if (!open || !product) return null;

  /* ===============================
     TILE IMAGE FROM BACKEND
     Handle both absolute URLs and relative paths
  ================================ */
  const tileUrl = product.tileImage
    ? product.tileImage.startsWith("http")
      ? product.tileImage
      : `${API_BASE}${product.tileImage}`
    : "";

  const activeMask =
    surface === "wall" ? selectedRoom.wallMask : selectedRoom.floorMask;

  return (
    <div className="visualize-overlay" onClick={onClose}>
      <div className="visualize-modal" onClick={(e) => e.stopPropagation()}>
        <button className="visualize-close" onClick={onClose}>✕</button>

        {/* ROOM SELECTOR */}
        <div className="room-selector">
          {ROOMS.map((room) => (
            <div
              key={room.id}
              className={`room-thumb ${selectedRoom.id === room.id ? "active" : ""}`}
              onClick={() => setSelectedRoom(room)}
            >
              <img src={room.base} alt={room.label} crossOrigin="anonymous" />
              <span>{room.label}</span>
            </div>
          ))}
        </div>

        {/* FLOOR / WALL TOGGLE */}
        <div className="surface-toggle">
          <button
            className={surface === "floor" ? "active" : ""}
            onClick={() => setSurface("floor")}
          >
            Floor
          </button>
          <button
            className={surface === "wall" ? "active" : ""}
            onClick={() => setSurface("wall")}
          >
            Wall
          </button>
        </div>

        {/* VISUALIZATION */}
        <div className="visualize-wrapper">
          <div className="room-wrapper">
            {/* Room Base Image */}
            <img
              src={selectedRoom.base}
              className="room-base"
              alt="Room"
              crossOrigin="anonymous"
            />

            {/* Tile Overlay with CSS Mask */}
            {tileUrl && (
              <div
                className="tile-overlay"
                style={{
                  backgroundImage: `url(${tileUrl})`,
                  WebkitMaskImage: `url(${activeMask})`,
                  WebkitMaskSize: "cover",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskImage: `url(${activeMask})`,
                  maskSize: "cover",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                }}
              />
            )}

            {/* Fallback message if no tile image */}
            {!tileUrl && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.15)",
                  color: "#fff",
                  fontSize: "14px",
                  borderRadius: "14px",
                }}
              >
                No tile image available
              </div>
            )}
          </div>

          <div className="visualize-info">
            <h2>{product.name}</h2>
            <p>Select a room and preview this tile on the {surface}.</p>
            {!API_BASE && (
              <p style={{ color: "red", fontSize: "12px" }}>
                ⚠️ VITE_API_URL is not set in your .env file
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}