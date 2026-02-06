import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        // optional auto redirect after few seconds
        const timer = setTimeout(() => {
            navigate("/");
        }, 6000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <section className="checout success">
            <h2>payment Successful</h2>

            <p>
                Thanks you for your payment. Your appointment Has been confirmed.
            </p>

            <p> You will recieve a confirmation shortly.

            </p>

            <button
            className="booking-btn"
            onClick={() => navigate("/")}
            >
                Back to Home
            </button>
        </section>
    );
}

export default PaymentSuccess;