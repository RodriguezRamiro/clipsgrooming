/* //clipsgrooming/src/components/Services.jsx */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEY, ACTIVE_BOOKING_KEY } from "../constants/bookingKeys";



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

  const EXPIRATION_MINUTES = 30;


  const loadBookings = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    // If old object-based data exists, reset safely
    return Array.isArray(parsed) ? parsed : [];
  };

  const saveBookings = (bookings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  };


  function Services({ externalOpen, clearExternalOpen }) {
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    // Mock Booking data (backend later)
    const [bookings, setBookings] = useState(() => loadBookings());
    // Client State
    const [clientInfo, setClientInfo] = useState({
      name: "",
      phone: "",
      notes: ""
    });

    const navigate = useNavigate();
    // Error State
    const [formError, setFormError] = useState("");

    useEffect(() => {
      const activeId = localStorage.getItem(ACTIVE_BOOKING_KEY);
      if (!activeId) return;

      const existing = bookings.find(b => b.id === activeId);
      if (existing) {
        navigate("/checkout", {
          state: { booking: existing },
          replace: true
        });
      }
    }, [bookings, navigate]);

    useEffect(() => {
      const now = Date.now();
      const updated = bookings.map(b => {
        if (b.status === "reserved" && b.expiresAt < now) {
          return { ...b, status: "expired" };
        }
        return b;
      });

      if (JSON.stringify(updated)  !== JSON.stringify(bookings)) {
        setBookings(updated);
        saveBookings(updated);
      }
    }, []);

    // availability check helper function
    const getUnavailableSlots = (date) => {
      const blocked = bookings
      .filter(
        b =>
        b.date === date &&
        (b.status === "reserved" || b.status === "paid")
      )
      .map(b => b.time);

      const activeId = localStorage.getItem(ACTIVE_BOOKING_KEY);
      if (active?.date === date) {
        blocked.push(active.time);
      }
    }
    return new Set(blocked);
  };

    const isBooked = (date, time) =>
      bookings.some(
        b =>
        b.date === date &&
        b.time === time &&
        (b.status === "reserved" || b.status === "paid")
      );

      useEffect(() => {
        if (externalOpen === "open" && !selectedService) {
          setSelectedService(services[0]);
        }
      }, [externalOpen, selectedService]);

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


                <h3>Book Appointment</h3>
                <p className="service-name">
                  {selectedService.name} — {selectedService.price}
                </p>


                {/*Service Selector */}
                <div className="form-group">
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
                </div>

                {/* Date */}
                <div className="form-group">
                <label className="modal-label">Select a date</label>
                <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                className="date-input"
                onChange={e => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
                />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <>
                  <label className="modal-label">Select a time</label>
                  <div className="time-slots">
                    {timeSlots.map(time => {
                      const booked = isBooked(
                        selectedDate,
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

                {/* Client Info */}
                {selectedDate && selectedTime && (
                  <>
                  <div className="client-form">
                    <label>Full Name</label>
                    <input
                    type="text"
                    placeholder="John Doe"
                    value={clientInfo.name}
                    onChange={(e) => {
                    setClientInfo({ ...clientInfo, name: e.target.value})
                    setFormError("");
                  }}
                  />
                  </div>

                  <div className="form-group">
                  <label>Phone Number</label>
                  <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={clientInfo.phone}
                  onChange={(e) => {
                  setClientInfo({ ...clientInfo, phone: e.target.value });
                  setFormError("");
                }}
                />
                </div>

                <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  placeholder="Special requests?"
                  value={clientInfo.notes}
                  onChange={(e) =>
                  setClientInfo({ ...clientInfo, notes: e.target.value})
                }
                />
                </div>

                    {/* booking UI */}
                    {formError && (
                      <p className="form-error">
                        {formError}
                      </p>
                    )}
                    <button
                      className="booking-btn"
                      disabled={
                        !clientInfo.name ||
                        !clientInfo.phone }
                        onClick={() => {
                          if (!clientInfo.name || !clientInfo.phone) {
                            setFormError("Please Enter your name and phone number to continue.");
                            return;
                          }

                          setFormError("");

                        const newBooking = {
                          id: crypto.randomUUID(),
                          service: selectedService.name,
                          price: selectedService.price,
                          date: selectedDate,
                          time: selectedTime,
                          client: { ...clientInfo },
                          status: "reserved",
                          createdAt: Date.now(),
                          expiresAt: Date.now() + EXPIRATION_MINUTES * 60 * 1000
                        };

                        const updated = [...bookings, newBooking];
                        setBookings(updated);
                        saveBookings(updated);
                        localStorage.setItem(ACTIVE_BOOKING_KEY, newBooking.id);


                        // Close modal + reset
                        setSelectedService(null);
                        setSelectedDate("");
                        setSelectedTime("");
                        setClientInfo({ name: "", phone: "", notes: "" });
                        clearExternalOpen?.();

                      // Navigate to check out with booking data
                      navigate("/checkout", {
                        state: { booking: newBooking }
                      });
                      }}
                    >

                      Confirm Booking
                    </button>
                  </>
                )}
              </div>
            </div>
        )}
      </section>
    );
  }

  export default Services;
