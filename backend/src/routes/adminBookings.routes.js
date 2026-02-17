/* backend/src/routes/adminBookings.routes.js */

import express from "express";
import {
    cancelBooking,
    refundBooking,
} from "../services/bookingActions.js";

const router = express.Router();

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
