/* //backend/src/controllers/adminController.js */

export async function getAllBookings(req, res) {
    const bookings = await Booking.find()
    .sort({ createdAt: -1 });

    res.json(bookings);
}