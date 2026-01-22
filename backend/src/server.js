import express from "express";
import dotenv from "dotenv";
import bookingsRouter from "./routes/bookings.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware

app.use(express.json());

// Api Route
app.use("/api/bookings", bookingsRouter);


//Test Route
app.get("/", (req, res) => {
    res.json({ status: "Clips Grooming API running " });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
