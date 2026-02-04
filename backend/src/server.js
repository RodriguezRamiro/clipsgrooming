import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookingsRouter from "./routes/bookings.routes.js";
import paymentsRouter from "./routes/payments.routes.js";



dotenv.config();
console.log("Stripe key loaded:", !! process.env.STRIPE_SECRET_KEY);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDb Connected"))
    .catch(err => console.error("MongoDB error:", err));
    console.log("Mongo URI:", process.env.MONGODB_URI);


const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
    origin:  (origin, callback) => {
        if (!origin) return callback(null, true); // allow curl / server to server
        if (origin.startsWith("http://localhost:")) {
            return callback(null, true);
        }

    callback(new Error("Not allowed by CORS"));
},
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


//Middleware

app.use(express.json());


//Test Route
app.get("/", (req, res) => {
    res.json({ status: "Clips Grooming API running " });
});

app.use("/api/bookings", bookingsRouter);
app.use("/api/payments", paymentsRouter);




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;
