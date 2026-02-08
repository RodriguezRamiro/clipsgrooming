/* src/components/PaymentCancel.jsx */

import { useNavigate } from "react-router-dom";

function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <section className="checkout cancel">
            <h2>Payment Canceled</h2>

            <p>
                No charges were made. You can try again or return to bookings.
            </p>

            <div className="checkout-actions">
                <button
                className="booking-btn"
                onClick={() => navigate("/")}
                >
                    Back to Home
                </button>

                <button
                className="secondary-btn"
                onClick={() => navigate("/booking")}
                >
                    Try Again
                </button>
            </div>
        </section>
    );
}

export default PaymentCancel;