
/* //clipsgrooming/src/components/Navbar.jsx */

import { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/barberLogo.png";


function Navbar({ toggleTheme }) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

    return (
      <nav className="navbar">
        <div className="logo-wrapper">
        <img
        src={logoImg}
        alt="Zandalio's Grooming logo"
        className="logo-img"
        />
        <h1 className="logo-text">Zandalio's Grooming
        </h1>
        </div>

        {/* Mobile Menu Toggle */}
        <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        >
        ☰
        </button>


      {/* navigation Links */}
        <ul className={`nav-links ${open ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>

          <li>
            <Link to="/services" onClick={closeMenu}>Services</Link>
          </li>

          <li>
            <Link to="/about" onClick={closeMenu}>About</Link>
          </li>

          <li>
            <Link to="/contact" onClick={closeMenu}>Contact</Link>
          </li>

          {/* Theme Toggle */}
          <li>
            <button
            className="theme-toggle"
            onClick={toggleTheme}
            arial-label="Toggle theme"
            >
             🌙
            </button>
          </li>
        </ul>
      </nav>
    );
  }

  export default Navbar;
