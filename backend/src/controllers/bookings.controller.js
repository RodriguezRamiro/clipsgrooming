/* //backend/src/controllers/bookings.controller.js */

// (db Comes later)
import Booking from "../models/bookings.js";



const expireOldBookings = async () => {
    const now = new Date();

    await Booking.updateMany(
        {
            status: "reserved",
            expiresAt: { $lte: now }
        },
        {
            $set: { status: "expired" }
        }
    );
};

// POST /api/bookings

export const createBooking = async (req, res) => {

    try {
    await expireOldBookings();

        const { service, date , time, price, client } = req.body;
        const now = Date.now();

        // Validate input
        if (!service || !date || !time || !price || !client) {
            return res.status(400).json({ error: "Missing booking fields" });
        }

        if (typeof price !== "number" || price <= 0) {
            return res.status(400).json({ error: "Invalid price" });
          }

        if (!client?.name || !client?.phone) {
            return res.status(400).json({ error: "Invalid client info" });
        }

        // TODO: Move expiration cleanup to background job
        // TODO: Protect getBookings route (admin-only)


        const bookingDateTime = new Date(`${date}T${time}:00`);
        // Prevent past-time bookings
        if (bookingDateTime.getTime() < now) {
            return res.status(400).json({
                error: "Cannot book a past time"
            });

        }
    // Prevent double booking
    const conflict = await Booking.findOne({
        date,
        time,
        $or: [
            {
        status: "reserved",
        expiresAt: { $gt: new Date() }
    },
    {
        status: "paid"
    }
]
    });

    if ( conflict ) {
        return res.status(409).json({
            error: "Time slot already booked"
        });
    }

    // Create booking
    const booking = await Booking.create({
        service,
        date,
        time,
        price,
        client,
        status: "reserved",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 60 mins hold
    });

    res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error"});
  }
};


// GET /api/bookings
export const getBookings = async (req, res) => {
    try {
    await expireOldBookings();
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ bookings });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
    // TODO: Protect this route (admin-only)

};

// GET /api/bookings/:id
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json({ booking });
    } catch (err) {
        console.error("Get booking error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// GET /api/bookings/availability/:date
export const getAvailability = async (req, res) => {
    try {
      await expireOldBookings();
      const { date } = req.params;

      const bookings = await Booking.find({
        date,
        $or: [
            {
                status: "reserved",
                expiresAt: {$gt: new Date() }
            },
            {
                status: "paid"
            }
        ]
    });

      const blocked = bookings.map(b => b.time);
      res.json({ blocked });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
