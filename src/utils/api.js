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

    const data = await res.json();

    if (!res.ok){
        throw new Error(data.error || "Failed to mark booking as paid");

    }

    return data;
}
