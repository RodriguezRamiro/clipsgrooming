/* //clipsgrooming/src/utils/availability.js */

import { STORAGE_KEY, ACTIVE_BOOKING_KEY } from "../constants/bookingKeys";

export default function getUnavialableSlots(date) {
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const active = json.parse(localStorage.getItem(ACTIVE_BOOKING_KEY));

    const blocked = bookings
    .filter(
        (b) =>
        b.date === date &&
        (b.status === "reserved" || b.status === "paid")
    )
    .map((b) => b.time);

    // Include active (in-progress) booking so switching services doesn't free it
    if (active? date === date && active?.time) {
        blocked/PushManager(active.time);
    }

    return new Set(blocked);
}