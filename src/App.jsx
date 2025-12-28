
import { useState } from "react"
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Profile from "./components/Profile";
import Services from "./components/Services";
import Footer from "./components/Footer";

function App() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <>
      <Navbar />
      <Banner id="home" />
      <Profile onBookNow={() => setSelectedService("open")} />
      <Services
      externalOpen={selectedService}
      clearExternalOpen={() => setSelectedService(null)}
      />
      <Footer />
    </>
  );
}

export default App;
