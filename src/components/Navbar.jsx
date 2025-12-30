
/* //clipsgrooming/src/components/Navbar.jsx */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/barberLogo.png";


function Navbar({ toggleTheme, theme }) {
  const [open, setOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const closeMenu = () => setOpen(false);

    return (
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="logo-wrapper" onClick={closeMenu}>
        <div className="logo-wrapper">
        <img
        src={logoImg}
        alt="Zandalio's Grooming logo"
        className="logo-img"
        />
        <h1 className="logo-text">Zandalio's Grooming
        </h1>
        </div>
        </Link>

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
            aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </li>
        </ul>
      </nav>
    );
  }

  export default Navbar;
