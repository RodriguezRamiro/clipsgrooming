/* //clipsgrooming/src/components/Checkout.jsx */

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { markBookingAsPaid } from "../utils/bookingStatus";
import { STORAGE_KEY, ACTIVE_BOOKING_KEY } from "../constants/bookingKeys";




function Checkout() {
    const navigate = useNavigate();
    const location = useLocation()
    const { state } = location;

    let booking = state?.booking;

    if (!booking) {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        booking = stored[stored.length -1];
    }
    // Never behave like temporary reservations, Prevents accidental overwrites
    if (booking?.status === "paid") {
        localStorage.removeItem(ACTIVE_BOOKING_KEY);
    }

        // If someone leaves checkout open too long → graceful redirect.
    useEffect(() => {
        if (booking?.status === "expired") {
          localStorage.removeItem(ACTIVE_BOOKING_KEY);
          navigate("/services", { replace: true });
        }
      }, [booking, navigate]);



    // If someone hits /check out directly
    if (!booking) {
        return (
            <div className="checkout">
                <h2>No booking found</h2>
                <button onClick={() => navigate("/services")}>
                    Back to Services
                </button>
            </div>
        );
    }


    return (
        <section className="checkout">
            <h2>Appointment Summary</h2>

            <div className="checkout-card">
                <p><strong>Service:</strong> {booking.service}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Name:</strong> {booking.client.name}</p>
                <p><strong>Phone:</strong> {booking.client.phone}</p>
                <p><strong>Price:</strong> {booking.price}</p>


                <p className={`checkout-status ${booking.status}`}>
                {booking.status === "paid" ? (
                    <strong> Payment complete. Seeyou Soon!</strong>
                    ) : (
                        <>
                <strong>Reservation confirmed.</strong>
                <br />
                Payment may be completed in person.
                </>
                )}
                </p>
                {booking.status === "reserved" && booking.expiresAt && (
                <p className="expiration-warning">
                    Reservation expires {" "}
                    {new Date(booking.expiresAt).toLocaleTimeString()}
                </p>
                )}
            </div>

            <div className="checkout-actions">
                <button className="booking-btn" onClick={() => {
                    const updatedBooking = markBookingAsPaid(booking.id);
                    navigate("/checkout", {
                        replace: true,
                        state: { booking: updatedBooking },
                    });
                }}
                >
                    Pay Now
                </button>



                <button
                className="reserved-btn"
                onClick={() => {
                    localStorage.removeItem(ACTIVE_BOOKING_KEY);
                    navigate("/", { replace: true });
                }}
                >
                    Reserve Only
                </button>
            </div>

                <p className="policy-note">
                    Appointment may be cancelled or rescheduled up to 24 hours in advance
                    No-shows may be subject to a fee.
                </p>
        </section>
    );
}

export default Checkout;