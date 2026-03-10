import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAccessModal.css";

function AdminAccessModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid admin credentials");
        return;
      }

      // ✅ SUCCESS
      onClose();
      navigate("/admin");
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="enquire-overlay">
      <div className="enquire-container">
        <button className="enquire-close" onClick={onClose}>
          ✕
        </button>

        <h3>Admin Access</h3>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>Enter</button>
      </div>
    </div>
  );
}

export default AdminAccessModal;
