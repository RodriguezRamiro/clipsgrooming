/* //clipsgrooming/src/components/Checkout.jsx */

import { useLocation, useNavigate } from "react-router-dom";

function Checkout() {
    const navigate = useNavigate();
    const { state } = useLocation();

    // If someone hits /check out directly
    if (!state?.booking) {
        return (
            <div className="checkout">
                <h2>No booking found</h2>
                <button onClick={() => navigate("/services")}>
                    Back to Services
                </button>
            </div>
        );
    }

    const { booking } = state;

    return (
        <section className="checkout">
            <h2>Appointment Summary</h2>

            <div className="checkout-card">
                <p><strong>Service:</strong> {booking.service}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Name:</strong> {booking.client.name}</p>
                <p><strong>Phone:</strong> {booking.client.phone}</p>
                <p><strong>Price:</strong> {booking.price}</p>

                <p className="checkout-status">
                    Status: <strong>{booking.status === "paid" ? "Paid" : "Reserved"}</strong>
                </p>
            </div>

            <div className="checkout-actions">
                <button className="booking-btn" disabled>
                    Pay Now (Coming Soon)
                </button>

                <button
                className="modal-close"
                onClick={() => navigate("/")}
                >
                    Finish
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