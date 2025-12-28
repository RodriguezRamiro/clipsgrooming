/* //clipsgrooming/src/components/Hero.jsx */

import profileImg from "../assets/barberProfile.jpg"

funciton Hero() {
    const scrollToServices = () => {
        document.getElementById("services").scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <section className="here">
            <div className="hero-overlay">
                <h1 className="hero-title">Zandalio's Grooming</h1>
                <p className="hero-subtitle">
                    Premium mobile grooming for professionals
                </p>

                <button className="hero-cta" onClick={scrollToServices}>
                    Book Now
                </button>
            </div>

            {/* Profile Image */}
            <div className="hero-profile">
                <img src={profileImg} alt="Zandalio Barber Portrait" />

                <div className="hero-profile-info">
                    <h4>Zandalio</h4>
                    <span> Master Barber</span>
                </div>
            </div>
        </section>
    );
}

export default Hero;
