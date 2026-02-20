/* //src/routes/bookings.routes.js */

import express from "express";
import {
    createBooking,
    getBookings,
    getAvailability,
} from "../controllers/bookings.controller.js";

const router = express.Router()

// Fetch all bookings
router.get("/", getBookings); // has to be admin only to prevent leaking client info

// Fetch unavailable slots for date
router.get("/availability/:date", getAvailability);

// Create a booking (reservation)
router.post("/", createBooking);

export default router;