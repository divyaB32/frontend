import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useEffect } from "react";

const Navbar = () => {
  useEffect(() => {
    // Load Google Font
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">Krishna Ceramics</div>

        <nav>
          <ul className="navbar-menu">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/collection">
                Collection
              </NavLink>
            </li>

            {/* ✅ NEW MODULE */}
            <li>
              <NavLink to="/match-tiles">
                Find Similar Tiles
              </NavLink>
            </li>

            <li>
              <NavLink to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;