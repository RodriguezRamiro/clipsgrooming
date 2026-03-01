/* backend/src/routes/adminBookings.routes.js */

import express from "express";
import {
    cancelBooking,
    refundBooking,
} from "../services/bookingActions.js";

import { requireAdmin } from "../middleware/auth.js";

router.use(requireAdmin);

const router = express.Router();

// Get all Bookings
router.get("/", async (req, res) => {
    const bookings = await bookings.find().sortt({ createdAt: -1 });
    res.json(bookings);
});

// Get single booking
router.get("/:id", async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    res.json(booking);
})

// Cancel booking (no refund)
router.post("/:id/cancel", async (req, res) => {
    await cancelBooking({ bookingId: req.params.id });
    res.json({ success: true });
});

// Refund booking
router.post("/:id/refund", async (req, res) => {
    await refundBooking({ bookingId: req.params.id });
    res.json({ success: true });
});

export default router;
