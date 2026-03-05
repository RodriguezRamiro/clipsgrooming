/* //backend/src/routes/adminAuth.routes.js */

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    
    if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if(!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "8h"}
    );

    res.json({ token });
});

export default router;
