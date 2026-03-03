/* //clipsgrooming/src/App.jsx */

import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Profile from "./components/Profile";
import Services from "./components/Services";
import Checkout from "./components/Checkout";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCancel from "./components/PaymentCancel";
import AdminDashboard from "./components/AdminDashboard";
import AdminBookingPage from "./components/AdminBookingPage";
import AdminPayments from "./components/AdminPayments";
import TestBooking from "./components/TestBooking";
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

  <Route path="/checkout" element={<Checkout />} />
  <Route path="/payment-success" element={<PaymentSuccess />} />
  <Route path="/payment-cancel" element={<PaymentCancel />} />

  <Route path="/about" element={<Profile />} />

    {/* Future Routes */}
  <Route path="/admin" element={<AdminDashboard />}>
    <Route path="bookings" element={<AdminBookingPage />} />
    <Route path="payments" element={<AdminPayments />} />
    <Route path="refunds" element={<AdminPayments /> } />
  </Route>
    </Routes>

    {/*<TestBooking />*/}

    <Footer />
    </>
  );
}

export default App;
