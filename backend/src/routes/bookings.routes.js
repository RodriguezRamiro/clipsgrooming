/* //src/routes/bookings.routes.js */

import express from "express";
import { createBooking } from "../controllers/bookings.controller.js";

const router = express.Router()

router.get("/", (req, res) => {
    res.json({ message: "GET bookings work"});
});

router.post("/", createBooking);

export default router;