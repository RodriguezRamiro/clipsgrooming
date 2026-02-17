/* src/components/BookingDetailsModal.jsx */

import { useEffect, useState } from "react";

export default function BookingDetailsModal({
    booking,
    onClose,
    onUpdated,
}) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const onEsc = (e) => e.key === "escape" && onClose();
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [onClose]);

    if (!booking) return null;

    const canCancel = booking.status === "reserved";
    const canRefund = booking.status === "paid";

    const cancelBooking = async () => {
        if (!confirm("cancel this booking and release the slot?")) return;
        setLoading(true);
        await fetch(`/api/admin/bookings/${booking._id}/cancel`, {
            method: "POST",
        });
        setLoading(false);
        onUpdated();
        onClose();
    };

    const refundBooking = async () => {
        if (!confirm("refound payment and release the slot?")) return;
        setLoading(true);
        await fetch(`/api/admin/bookings/${booking.id}/refund`, {
            method: "POST",
        });
        setLoading(false);
        onUpdated();
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={onclose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header>
                <h2>Booking Details</h2>
                <button onClick={onClose}>x</button>
            </header>

        <section>
            <h4>Booking</h4>
            <p><b>Service:</b> {booking.service}</p>
            <p><b>Date:</b> {booking.date}</p>
            <p><b>Time:</b> {booking.time}</p>
            <p><b>Status:</b> {booking.status}</p>
            <p><b>Locked:</b> {booking.locked ? "Yes" : "No"}</p>
        </section>

        <section>
            <h4>Client</h4>
            <p><b>Name:</b> {booking.client.name}</p>
            <p><b>Phone:</b> {booking.client.phone}</p>

        </section>

        <section>
            <h4>Payment</h4>
            <p><b>Paid:</b> {booking.paid ? "Yes" : "No"}</p>
            {booking.paymentIntentId && (
            <p><b>PaymentIntent:</b> {booking.paymentIntentId}</p>
          )}
        </section>

        <footer>
          {canCancel && (
            <button disabled={loading} onClick={cancelBooking}>
              Cancel Booking
            </button>
          )}
          {canRefund && (
            <button disabled={loading} onClick={refundBooking}>
              Refund Booking
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
