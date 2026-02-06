/* //clipsgrooming/src/utils/api.js */

const API_BASE = "http://localhost:5000/api";

export async function createBooking(payload) {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create booking");
    }

    return res.json()
}

export async function getBookings() {
    const res = await fetch(`${API_BASE}/bookings`);

    if(!res.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return res.json();
}

export async function markBookingPaid(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}/pay`, {
        method: "PATCH",
    });

    if (!res.ok){
        const text = await res.text();
        throw new Error(text || "Failed to mark booking as paid");

    }

    return res.json();
}

export async function createCheckoutSession(bookingId) {
    const res = await fetch("/api/payments/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create checkout session");
    }

    return res.json(); // { url }
  }
