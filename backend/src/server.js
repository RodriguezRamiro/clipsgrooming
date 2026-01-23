import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bookingsRouter from "./routes/bookings.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS first
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}))


//Middleware

app.use(express.json());


//Test Route
app.get("/", (req, res) => {
    res.json({ status: "Clips Grooming API running " });
});

app.use("/api/bookings", bookingsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
