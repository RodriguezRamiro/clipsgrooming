/* //backend/src/controllers/bookings.controller.js */

// (db Comes later)

import { bookings } from "../data/bookings.js";
import crypto from "crypto";



const expireOldBookings = () => {
    const now = Date.now();

    bookings.forEach(b => {
        if (
            b.status === "reserved" &&
            new Date(b.expiresAt).getTime() <= now
        ) {
            b.status = "expired";
        }
    });
};

// POST /api/bookings

export const createBooking = (req, res) => {
    expireOldBookings();

    const { service, date , time, price, client } = req.body;
    const now = new Date().now;

    // Validate input
    if (!service || !date || !time || !price || !client) {
        return res.status(400).json({ error: "Missing booking fields" });
    }

    const bookingDateTime = new Date(`${date} ${time}`);

    // Prevent past-time bookings
    if (bookingDateTime.getTime() < now) {
        return res.status(400).json({
            error: "Cannot book a past time"
        });
    }

    // Prevent double booking
    const conflict = booking.find(b =>
        b.date=== date &&
        b.time === time &&
        (b.status === "reserved" || b.status === "paid")
        );

    if ( conflict ) {
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
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 60 mins hold
    };

    booking.push(booking);

    res.status(201).json({ booking });
};


// GET /api/bookings
export const getBookings = (req, res) => {
    expireOldBookings();
    res.json({ bookings });
};

// GET /api/bookings/availability/:date
export const getAvailability = (req, res) => {
    expireOldBookings();

    const { date } = req.params;

    const blocked = bookings.filter(
        b =>
        b.date === date &&
        (b.status === "reserved" || b.status === "paid") &&
        new Date(expiresAt).getTime() > now
    )
    .map(b => b.time);

    res.json({ blocked });
};

// PATCH /api/bookings/:id/pay
export const markBookingPaid = (req, res) => {
    const { id } = req.params;
    const now = Date.now();

    const booking = bookings.find(b => b.id === id);

    if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "paid") {
        return res.status(400).json({ error: "Booking already paid" });
    }

    if (booking.status === "expired") {
        return res.status(400).json({ error: " booking has expired" });
    }

    if ( booking.status === reserved &&
        new Date(booking.expiresAt).getTime() <= now
        ) {
            booking.status = "expired";
            return res.status(40).json({ error: "reservaion expired" });
        }

        booking.status = "paid";
        booking.paidAt = new Date().toISOString();

        res.json({ booking });
};