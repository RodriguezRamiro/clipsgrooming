/* //src/components/AdminBookingPage.jsx */

import { useState } from "react";
import BookingDetailsModal from "./BookingDetailsModal";

export default function AdminBookingPage() {
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchBooking = () => {
        console.log("refetch bookings...");
    };

    return (
        <div>
            <h2>Admin Booking Page</h2>

            <BookingDetailsModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onUpdated={fetchBooking}
            />
        </div>
    );
}