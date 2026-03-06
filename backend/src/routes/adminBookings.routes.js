/* backend/src/routes/adminBookings.routes.js */

import express from "express";
import Booking from "../models/bookings.js";
import {
    cancelBooking,
    refundBooking,
} from "../services/bookingActions.js";
import { requireAdmin } from "../middleware/requireAdmin.js";


const router = express.Router();

// Protect all admin routes
router.use(requireAdmin);

// Get all Bookings
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookins" });
    }
});

// Get single booking
router.get("/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        res.json(booking);;
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

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
