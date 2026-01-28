/* //src/routes/bookings.routes.js */

import express from "express";
import {
    createBooking,
    getBookings,
    getAvailability,
    markBookingPaid
} from "../controllers/bookings.controller.js";

const router = express.Router()

// Fetch all bookings
router.get("/", getBookings);

// Fetch unavailable slots for date
router.get("/availability/:date", getAvailability);

// Create a booking
router.post("/", createBooking);

// New
router.patch("/:id/pay", markBookingPaid);


export default router;