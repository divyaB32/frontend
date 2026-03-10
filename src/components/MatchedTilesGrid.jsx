import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function MatchedTilesGrid({ tiles }) {
  const navigate = useNavigate();

  if (!tiles.length) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 200px)", gap: "20px" }}>
      {tiles.map(tile => (
        <div
          key={tile._id}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/product/${tile._id}`)}
        >
          <img
            src={`${BASE_URL}${tile.tileImage}`}
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <p>{tile.name}</p>
        </div>
      ))}
    </div>
  );
}