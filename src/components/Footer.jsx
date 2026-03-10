import { NavLink } from "react-router-dom";
import "./Footer.css";
import { useState } from "react";
import AdminAccessModal from "./AdminAccessModal";

const Footer = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

  return (
    <>
      <footer
        className="footer"
        onMouseEnter={() => setShowAdmin(true)}
        onMouseLeave={() => setShowAdmin(false)}
      >

        {/* MAIN FOOTER */}
        <div className="footer-container">

          {/* BRAND */}
          <div className="footer-brand">
            <h3>Krishna Ceramics</h3>
            <p>
              Premium glazed vitrified tiles crafted with masterful
              artistry. Transforming spaces with elegance and durability.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/collection">Tile Collection</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact Us</NavLink>
              </li>
            </ul>
          </div>

          {/* CONTACT DETAILS */}
          <div className="footer-contact">
            <h4>Visit Our Showroom</h4>

            <div className="footer-contact-item">
              <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <p>
                2/819, Mahalaxmi Nagar,<br />
                Tiruppur Main Road,<br />
                Palladam – 641 664,<br />
                Tamil Nadu, India
              </p>
            </div>

            <div className="footer-contact-item">
              <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <p>+91 98436 20156</p>
            </div>

            <div className="footer-contact-item">
              <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <p>krishnaceramics@yahoo.in</p>
            </div>

          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          © 2025 Krishna Ceramics. All rights reserved.

          {/* 🔒 INVISIBLE ADMIN (SHOWS ONLY ON HOVER) */}
          {showAdmin && (
            <span
              className="footer-admin"
              onClick={() => setOpenAdmin(true)}
            >
              Admin
            </span>
          )}
        </div>

      </footer>

      {/* ADMIN ACCESS MODAL */}
      {openAdmin && (
        <AdminAccessModal onClose={() => setOpenAdmin(false)} />
      )}
    </>
  );
};

export default Footer;
