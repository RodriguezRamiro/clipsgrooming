
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Profile from "./components/Profile";
import Services from "./components/Services";
import Footer from "./components/Footer";

function App() {
  const [theme, setTheme] = useState("dark");
  const [bookingOpen, setBookingOpen] = useState(false);

  const toggleTheme = () =>
  setTheme(theme === "dark" ? "light" : "dark");

  // Load Saved Theme

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  //Apply / persist theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);



  return (
    <>
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <Routes>
        <Route
          path="/"
          element={
        <>
          <Banner id="home" />
          <Profile onBookNow={() => setBookingOpen("true")} />
          <Services
          bookingOpen={bookingOpen}
          setBookingOpen={setBookingOpen}
      />
      </>
    }
    />

    <Route
    path="/services"
    element={
    <Services
      bookingOpen={bookingOpen}
      setBookingOpen={setBookingOpen}
      />
      }
      />
    <Route path="/about" element={<Profile />} />

    {/* Future Routes */}
    </Routes>

    <Footer />
    </>
  );
}

export default App;
