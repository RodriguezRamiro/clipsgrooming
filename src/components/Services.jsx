/* //clipsgrooming/src/components/Services.jsx */

import { useState, useEffect } from "react";

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

  const STORAGE_KEY = "clipsgrooming_bookings";

  const loadBookings = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const savedBookings = (bookings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  };


  function Services({ externalOpen, clearExternalOpen }) {
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    // Mock Booking data (backend later)
    const [bookedSlots, setBookedSlots] = useState(() => loadBookings());
    const [bookingConfirmed, setBookingConfirmed] = useState(false);



    const isBooked = (date, serviceName, time) =>
      bookedSlots[date]?.[serviceName]?.includes(time);

      useEffect(() => {
        if (externalOpen === "open" && !selectedService) {
          setSelectedService(services[0]);
        }
      }, [externalOpen]);



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
                  setSelectedService(service);
                  setSelectedDate("");
                  setSelectedTime("");
                  setBookingConfirmed(false);
              }}
            >
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

                <h3>Book Appointment</h3>

                {/*Service Selector */}
                <label>Service</label>
                <select
                  value={selectedService.name}
                  onChange={(e) => {
                    const service = services.find(
                      s => s.name === e.target.value
                    );
                    setSelectedService(service);
                    // reset time on service change
                    setSelectedTime("");
                  }}
                >
                  {services.map(service => (
                    <option key={service.name} value={service.name}>
                      {service.name} — {service.price}
                    </option>
                  ))}
                </select>

                {/* Date */}
                <label className="modal-label">Select a date</label>
                <input
                type="date"
                value={selectedDate}
                className="date-input"
                onChange={e => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
                />

                {/* Time Slots */}
                {selectedDate && (
                  <>
                  <label className="modal-label">Select a time</label>
                  <div className="time-slots">
                    {timeSlots.map(time => {
                      const booked = isBooked(
                        selectedDate,
                        selectedService.name,
                        time
                      );

                      return (
                        <button
                        key={time}
                        disabled={booked}
                        className={`time-slot
                        ${booked ? "booked" : ""} ${
                          selectedTime === time ? "active" : ""
                        }`}
                        onClick={() => setSelectedTime(time)}
                        >
                          {booked ? "Booked" : time}
                        </button>
                      );
                    })}
                    </div>
                    </>
                )}

              {!bookingConfirmed ? (
                <>
                  {/* EXISTING booking form UI */}
                </>
              ) : (
                <>
                  <h3>Booking Confirmed ✅</h3>

                  <p><strong>Service:</strong> {selectedService.name}</p>
                  <p><strong>Date:</strong> {selectedDate}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>

                  <p style={{ marginTop: "1rem", color: "var(--muted-gray)" }}>
                    We’ll see you then. If you need to reschedule, please contact us.
                  </p>

                  <button
                    className="booking-btn"
                    onClick={() => {
                      setSelectedService(null);
                      setSelectedDate("");
                      setSelectedTime("");
                      setBookingConfirmed(false);
                      clearExternalOpen?.();
                    }}
                  >
                    Done
                  </button>
                </>
              )}

                {/* Confirm */}
                <button
                className="booking-btn"
                disabled={!selectedDate || !selectedTime}
                onClick={() => {
                  const updated = { ...bookedSlots };

                  updated[selectedDate] ??= {};
                  updated[selectedDate][selectedService.name] ??=[];
                  updated[selectedDate][selectedService.name].push(selectedTime);

                  setBookedSlots(updated);
                  savedBookings(updated);
                  setBookingConfirmed(true);

                }}
                >
                  Confirm Booking
                </button>

                <button
                className="modal-close"
                onClick={() => {
                  setSelectedService(null);
                  setSelectedDate("");
                  setSelectedTime("");
                  clearExternalOpen?.();
                }}
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
