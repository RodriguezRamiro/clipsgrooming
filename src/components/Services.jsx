/* //clipsgrooming/src/components/Services.jsx */

import { useState } from "react";

const services = [
    { name: "Line Up", price: "$25", description: "Clean lineup and edges" },
    { name: "Kids Cuts", price: "$30", description: "Stylish cuts for kids" },
    { name: "Standard Cut", price: "$35", description: "Classic haircut" },
    { name: "Facial Hair Only", price: "$20", description: "Beard trim & shape" },
    { name: "Cut and Facial", price: "$50", description: "Haircut + beard" },
    { name: "The VIP", price: "$75", description: "Full premium service" }
  ];

  function Services() {
    const [selectedService, setSelectedServices] = useState(null);

    return (
      <section className="services">
        <h2>Menu</h2>

        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card"
            key={service.name}
            onClick={() => setSelectedServices(service)}
            >

              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p className="price">{service.price}</p>
            </div>
          ))}
        </div>

        {/* Modal placeholder */}
        {selectedService && (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>{setSelectedServices.name}</h3>
                <p>{selectedService.description}</p>
                <p className="price">{selectedService.price}</p>

                <button className="booking-btn">Continue Booking</button>
                <button className="modal-close"
                onClick={() => setSelectedServices(null)}
                >
                    Close
                </button>
            </div>
        </div>
        )}
      </section>
    );
  }

  export default Services;
