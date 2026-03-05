/* //backend/createAdmin.js */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "./src/models/admin.js";
import dotenv from "dotenv";

dotenv.config()

if (!process.argv[2]) {
    console.log("Usage: node createAdmin.js admin123");
    process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const hashedPassword = await bcrypt.hash(process.argv[2], 10);

await Admin.create({
    email: "admin@clipsgrooming.com",
    password: hashedPassword,
});

console.log("Admin created");
process.exit();