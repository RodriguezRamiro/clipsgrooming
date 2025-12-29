

import React from 'react';
import logoImg from "../assets/barberLogo.png";


function Navbar() {
    return (
      <nav className="navbar">
        <div className="logo-wrapper">
        <img src={logoImg} alt="Zandalio's Grooming logo" className="logo-img" />
        <h1 className="logo-text">Zandalio's Grooming
        </h1>
        </div>

        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#appointment booking">Appointment Booking</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
    );
  }

  export default Navbar;
