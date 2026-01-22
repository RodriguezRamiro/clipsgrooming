/* //clipsgrooming/src/components/Services.jsx */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../utils/api";
import { STORAGE_KEY, ACTIVE_BOOKING_KEY } from "../constants/bookingKeys";



const services = [
    { name: "Line Up", price: 25, description: "Clean lineup and edges" },
    { name: "Kids Cuts", price: 30, description: "Stylish cuts for kids" },
    { name: "Standard Cut", price: 35, description: "Classic haircut" },
    { name: "Facial Hair Only", price: 20, description: "Beard trim & shape" },
    { name: "Cut and Facial", price: 50, description: "Haircut + beard" },
    { name: "The VIP", price: 75, description: "Full premium service" }
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
    const navigate = useNavigate();

    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    // Mock Booking data (backend later)
    const [bookings, setBookings] = useState(loadBookings);
    const [formError, setFormError] = useState("");

    // Client State
    const [clientInfo, setClientInfo] = useState({
      name: "",
      phone: "",
      notes: ""
    });

    // Redirect if active booking exists
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

    // Expire old reservations
    useEffect(() => {
      const now = Date.now();
      const updated = bookings.map(b =>
        b.status === "reserved" && b.expiresAt < now
        ? { ...b, status: "expired" }
        : b
        );

      if (JSON.stringify(updated)  !== JSON.stringify(bookings)) {
        setBookings(updated);
        saveBookings(updated);
      }
    }, []);

    // availability check helper
    const getUnavailableSlots = (date) => {
      const blocked = bookings
      .filter(
        b =>
        b.date === date &&
        (b.status === "reserved" || b.status === "paid")
      )
      .map(b => b.time);

      const activeId = localStorage.getItem(ACTIVE_BOOKING_KEY);
      if (activeId) {
        const active = booking.find(b => b.id === activeId);
        if (active?.date === date) {
        blocked.push(active.time);
      }
    }

    return new Set(blocked);
  };

  useEffect(() => {
    if (externalOpen === "open" && selectedService) {
      setSelectedServices(services[0]);
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

              <button
              className="booking-btn"
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

                    if (
                      selectedDate &&
                      getUnavailableSlots(selectedDate).has(selectedTime)
                    ) {

                    // reset time on service change
                    setSelectedTime("");
                    }
                  }}
                >
                  {services.map(s => (
                    <option key={s.name} value={s.name}>
                      {s.name} — {s.price}
                    </option>
                  ))}
                </select>
                </div>

                {/* Date */}
                <div className="form-group">
                <label>Select a date</label>
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
                      const booked =
                      getUnavailableSlots(selectedDate).has(time);

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
                  <input
                  placeholder="Full Name"
                  value={clientInfo.name}
                  onChange={e =>
                    setClientInfo({ ...clientInfo, name: e.target.value })
                  }
                />
                  <input
                  placeholder="Phone"
                  value={clientInfo.phone}
                  onChange={e =>
                    setClientInfo({ ...clientInfo, phone: e.target.value })
                  }
                />

                {formError && <p className="form-error">{formError}</p>}

                    {/* booking UI */}
                    <button
                      className="booking-btn"
                      onClick={async () => {
                        try {
                          if (!clientInfo.name || !clientInfo.phone) {
                            setFormError("Name and phone are required.");
                            return;
                          }

                          const payload = {
                            service: selectedService.name,
                            price: selectedService.price,
                            date: selectedDate,
                            time: selectedTime,
                            client: clientInfo,
                          };

                          const { booking } = await createBooking(payload);

                          localStorage.setItem(ACTIVE_BOOKING_KEY, booking.id);

                          navigate("/checkout", {
                            state: { booking },
                          });

                        } catch (err) {
                          setFormError(err.message);
                        }
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
