/* //backend/src/controllers/bookings.controller.js */

// temp in memore store (db Comes later)

import { bookings } from "../data/bookings.js";
import crypto from "crypto";


const now = Date.now();

// POST /api/bookings

export const createBooking = (req, res) => {
    const { service, date , time, price, client } = req.body;
    const now = new Date().now;

    // Validate input
    if (!service || !date || !time || !price || !client) {
        return res.status(400).json({ error: "Missing booking fields" });
    }

    if (bookingDateTime.getTime() < now) {
        return res.status(400).json({
            error: "Cannot book a past time"
        });
    }

    // prevent past-time bookings
    const bookingDateTime = new Date(`${date} ${time}`);
    if (bookingDateTime.getTime() < now ) {
        return res.status(400).json({
            error: "Cannot book a past time slot"
        });
    }


    // Prevent double booking
    const conflict = bookings.find(b =>
        b.date === date &&
        b.time === time &&
        (b.status === "reserved" ||
        b.status === "paid") &&
        new Date(b.expiresAt).getTime() > now
        );

        if (conflict) {
            return res.status(409).json({
                error: "Time slot already booked"
            });
        }

    // Create booking
    const booking = {
        id: crypto.randomUUID(),
        service,
        date,
        time,
        price,
        client,
        status: "reserved",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 60 mins
    };

    bookings.push(booking);

    res.status(201).json({ booking });
};

// GET /api/bookings
export const getBookings = (req, res) => {
    res.json({ bookings });
};

export const getAvailability = (req, res) => {
    const { date } = req.params;
    const now = Date.now();

    const blocked = bookings.filter(
        b =>
        b.date === date &&
        (b.status === "reserved" || b.status === "paid") &&
        new Date(expiresAt).getTime() > now
    )
    .map(b => b.time);

    res.json({ blocked });
};