import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware

app.use(express.json());

//Test Route
app.get("/", (req, res) => {
    res.json({ status: "API running " });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

