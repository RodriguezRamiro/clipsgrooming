/* //clipsgrooming/src/components/TestBooking.jsx */

import { useState } from "react";
import { createBooking, getBookings } from "../utils/api";

export default function TestBooking() {
    const [bookings, setBookings] = useState([]);

    const handleCreate = async () => {
        const booking = {
            service: "Haircut",
            date: "2026-01-22",
            time: "3:00 PM",
            price: 35,
            client: "Jphn Doe",
        };

        try {
            const res = await createBooking(booking);
            console.log("Created:", res);
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleFetch = async () => {
        const res = await getBookings();
        setBookings(res.bookings);
    };

    return (
        <div style={{ padding: 20 }}>
            <button onClick={handleCreate}>Create Booking</button>
            <button onClick={handleFetch}>Fetch Bookings</button>

            <pre>{JSON.stringify(bookings, null, 2)} </pre>
        </div>
    );
}
