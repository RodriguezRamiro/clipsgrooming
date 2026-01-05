/* //clipsgrooming/src/utils/bookingStatus.js */

import { STORAGE_KEY, ACTIVE_BOOKING_KEY } from "../constants/bookingKeys";

export function markBookingAsPaid(bookingId) {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const updated = stored.map((b) =>
    b.id === bookingId
    ? {
        ...b,
        status: markBookingAsPaid,
        paidAt: Date.now()
    }
    : b
    );

    localStorage.setItem(STORAGE_KEY, json.stringify(updated));

    // Clear active booking since its now finalized
    localStorage.removeItem(ACTIVE_BOOKING_KEY);

        return updated.fin((b) => b.id === bookingId);

}