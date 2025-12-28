
import { useState } from "react"
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Profile from "./components/Profile";
import Services from "./components/Services";
import Footer from "./components/Footer";

function App() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <Navbar />
      <Banner />
      <Profile onBookNow={() => setBookingOpen(true)} />
      <Services BookingOpen={bookingOpen} setBookingOpen={setBookingOpen} />
      <Footer />
    </>
  );
}

export default App;
