import { useState } from "react";
import "./visualize.css";

/* ===============================
   BACKEND BASE URL
================================ */
const API_BASE = import.meta.env.VITE_API_URL;

/* ===============================
   ROOM CONFIG
================================ */
const ROOMS = [
  {
    id: "small",
    label: "Small Room",
    base: "/rooms/living/small_room.jpg",
    floorMask: "/mask/Floor/small_room_floor_mask.png",
    wallMask: "/mask/Wall/small_room_wall.png",
  },
  {
    id: "medium",
    label: "Medium Room",
    base: "/rooms/living/medium_room.jpg",
    floorMask: "/mask/Floor/medium_room_floor_mask.png",
    wallMask: "/mask/Wall/medium_room_wall.png",
  },
  {
    id: "large",
    label: "Large Room",
    base: "/rooms/living/large_room.jpg",
    floorMask: "/mask/Floor/large_room_floor_mask.png",
    wallMask: "/mask/Wall/large_room_wall.png",
  },
  {
    id: "extra",
    label: "Extra Large",
    base: "/rooms/living/extra_large_room.jpg",
    floorMask: "/mask/Floor/extra_large_room_floor_mask.png",
    wallMask: "/mask/Wall/extra_large_room_wall.png",
  },
];

export default function Visualize({ open, onClose, product }) {
  if (!open || !product) return null;

  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
  const [surface, setSurface] = useState("floor");

  /* ===============================
     TILE IMAGE FROM BACKEND
  ================================ */
  const tileUrl = product.tileImage
    ? `${API_BASE}${product.tileImage}`
    : "";

  return (
    <div className="visualize-overlay">
      <div className="visualize-modal">
        <button className="visualize-close" onClick={onClose}>✕</button>

        {/* ROOM SELECTOR */}
        <div className="room-selector">
          {ROOMS.map(room => (
            <div
              key={room.id}
              className={`room-thumb ${selectedRoom.id === room.id ? "active" : ""}`}
              onClick={() => setSelectedRoom(room)}
            >
              <img src={room.base} alt={room.label} />
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
            <img
              src={selectedRoom.base}
              className="room-base"
              alt="Room"
            />

            <div
              className="tile-overlay"
              style={{
                backgroundImage: tileUrl ? `url(${tileUrl})` : "none",
                WebkitMaskImage: `url(${
                  surface === "wall"
                    ? selectedRoom.wallMask
                    : selectedRoom.floorMask
                })`,
                maskImage: `url(${
                  surface === "wall"
                    ? selectedRoom.wallMask
                    : selectedRoom.floorMask
                })`,
              }}
            />
          </div>

          <div className="visualize-info">
            <h2>{product.name}</h2>
            <p>
              Select a room and preview this tile on the {surface}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}