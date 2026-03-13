/* //backend/src/middleware/requireAdmin.js */

import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
    console.log("Aduthorization header:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];


    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token", decoded)

        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        req.admin = decoded;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}