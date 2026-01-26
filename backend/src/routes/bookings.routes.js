/* //src/routes/bookings.routes.js */

import express from "express";
import { createBooking, getBookings, getAvailability } from "../controllers/bookings.controller.js";

const router = express.Router()

// Fetch all bookings
router.get("/", getBookings);

// Fetch unavailable slots for date
router.get("/availability/:date", getAvailability);

// Create a booking
router.post("/", createBooking);


export default router;