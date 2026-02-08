import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    // Stripe may append ?sesion_id=...
    const sessionId = new URLSearchParams(location.search).get("session_id");

    useEffect(() => {
        // optional auto redirect after few seconds
        const timer = setTimeout(() => {
            navigate("/");
        }, 7000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <section className="checkout success">
            <h2>Payment Successful</h2>

            <p>
                Your payment was proccessed successfully and your appointment is confirmed.
            </p>

            <p>
                If you have any questions, feel free to reach out.
            </p>

            <div className="checkout-actions">
            <button
            className="booking-btn"
            onClick={() => navigate("/")}
            >
                Back to Home
            </button>
         </div>
        </section>
    );
}

export default PaymentSuccess;