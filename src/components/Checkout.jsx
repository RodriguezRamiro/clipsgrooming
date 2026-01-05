/* //clipsgrooming/src/components/Checkout.jsx */

import { useLocation, useNavigate } from "react-router-dom";


const STORAGE_KEY = "clipsgrooming_bookings";



function Checkout() {
    const navigate = useNavigate();
    const location = useLocation()
    const { state } = location;

    let booking = state?.booking;

    if (!booking) {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        booking = stored[stored.length -1];
    }


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

                <p className={`checkout-status" ${booking.status}`}>
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
            </div>

            <div className="checkout-actions">
                <button className="booking-btn" disabled>
                    Pay Now (Coming Soon)
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