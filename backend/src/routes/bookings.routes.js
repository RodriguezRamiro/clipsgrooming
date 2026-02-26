/* //src/routes/bookings.routes.js */

import express from "express";
import {
    createBooking,
    getBookings,
    getAvailability,
    getBookingById,
} from "../controllers/bookings.controller.js";

const router = express.Router()

// Fetch all bookings
router.get("/", getBookings); // has to be admin only to prevent leaking client info


// Fetch unavailable slots for date
router.get("/availability/:date", getAvailability);

router.get("/:id", getBookingById);

// Create a booking (reservation)
router.post("/", createBooking);

export default router;