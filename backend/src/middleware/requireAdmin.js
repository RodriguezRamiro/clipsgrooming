export function requireAdmin(req, res, next) {
    const adminSecret = req.headers["x-admin-secret"];

    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    next();
}