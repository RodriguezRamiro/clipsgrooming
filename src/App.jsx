import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Profile from "./components/Profile";
import Services from "./components/Services";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Banner id="home" />
      <Profile />
      <Services id="services"/>
      <Footer />
    </>
  );
}

export default App;
