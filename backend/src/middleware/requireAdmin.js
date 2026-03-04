/* //backend/src/middleware/requireAdmin.js */

import jwt from "jsonwebtoken";

export function requireAdmin(rew, res, next) {
    const authHeader = req.header.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}