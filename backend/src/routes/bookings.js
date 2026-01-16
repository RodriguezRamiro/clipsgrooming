/* //clipsgrooming/backend/src/routes/bookings.js */

import express from "express";
import { bookings } from "../data/bookings.js";
import crypto from "crypto";

const router = express.Router();

// POST /api/bookings > create reservation

router.post("/", (req, res) => {
    const { service, date, time, price, client } = req.body;

    if (!service || !date || !time || !price || !client) {
        return res.status(400).json({ error: "Missing booking fields"});
    }

    const booking = {
        id: crypto.randomUUID(),
        service,
        date,
        time,
        price,
        client,
        status: "reserved",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45 mins
    }

    bookings.push(booking);

    res.status(201).json({ booking });
});

export default router;