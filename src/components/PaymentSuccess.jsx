import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getBookingById } from "../utils/api";

function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    const bookingId = location.state?.booking?._id

    const [status, setStatus] = useState("checking") // checking | paid | error
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        if (!bookingId) {
            setStatus("error");
            return;
        }

        const interval = setInterval(async () => {
            try {
                const { booking } = await getBookingById(bookingId);

                if (booking.status === "paid") {
                    setStatus("paid");
                    clearInterval(interval);

                    // optional auto-redirect
                    setTimeout(() => navigate("/"), 7000);
                } else {
                    setAttempts(a => a + 1);
                }

                // fail-safe timeout (~20 seconds)
                if (attempts > 10) {
                    setStatus("error");
                    clearInterval(interval);
                }
            } catch (err) {
                console.error("Verification errpr:", err);
                setStatus("error");
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [bookingId, attempts, navigate]);

    // UI
    if (status === "checking") {
        return (
            <section className="checkout success">
            <h2>Confirm Payment...</h2>
            <p>Please Wait while your appointment finilizes.</p>
            <div className="spinner" />
            </section>
            );
        }

        if (status === "error") {
            return (
                <section className="checkout error">
                    <h2> Payment Processing</h2>
                    <p>
                        Your payment may still be processing.
                        if this page does not update, please contact support.
                    </p>
                    <button className="booking-btn" onClick={() => navigate("/")}>
                        Back to Home
                    </button>
                </section>
            )
        }

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