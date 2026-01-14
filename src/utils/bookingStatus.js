/* //clipsgrooming/src/utils/bookingStatus.js */

import { STORAGE_KEY, ACTIVE_BOOKING_KEY } from "../constants/bookingKeys";

export function markBookingAsPaid(bookingId) {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const updated = stored.map((b) =>
    b.id === bookingId
    ? {
        ...b,
        status: markBookingAsPaid,
        paidAt: Date.now(),
        expiresAt: null,
    }
    : b
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Clear active booking its now finalized
    localStorage.removeItem(ACTIVE_BOOKING_KEY);

        return updated.find(b => b.id === bookingId);

}