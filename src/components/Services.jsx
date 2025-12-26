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

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM"
  ];


  function Services() {
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState("");

    // Mock Booking data (backend later)
    const [bookedSlots , setBookedSlots] = useState({
      "2025-01-10": ["9:00 AM", "10:30 AM"]
    });

    const isBooked = (date, time) =>
    bookedSlot[date]?.includes(time);


    return (
      <section className="services">
        <h2>Menu</h2>

        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card"
            key={service.name}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p className="price">{service.price}</p>
              <button className="booking-btn"
              onClick={() => {
                selectedService(service);
                setSelectedDate("");
                setSelectedTime("");
              }}>
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Modal placeholder */}
        {selectedService && (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>{selectedService.name}</h3>
                <p>{selectedService.description}</p>
                <p className="price">{selectedService.price}</p>

                <label className="modal-label">Select a date</label>
                <input
                type="date"
                value={selectedDate}
                className="date-input"
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
                />

                {selectedDate && (
                  <>
                  <label>Select a time</label>
                  <div className="time-slots">
                    {timeSlots.map(time => {
                      const booked = isBooked(selectedDate, time);

                      return (
                        <button
                        key={time}
                        disabled={booked}
                        className={`time-slots
                        ${selectedTime === time ? "active" : ""}
                        ${booked ? "booked" : ""}
                        `}
                        onClick={() => setSelectedTime(time)}
                        >
                          {booked ? "Booked" : time}
                        </button>
                      );
                    })}
                    </div>
                    </>
                )}

                <button
                className="booking-btn"
                disabled={!selectedDate || !selectedTime}
                >
                  Continue Booking
                </button>

                <button
                className="modal-close"
                onClick={() => setSelectedService(null)}
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
