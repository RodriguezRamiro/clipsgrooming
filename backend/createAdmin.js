/* //backend/createAdmin.js */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "./src/models/admin.js";
import dotenv from "dotenv";

dotenv.config()

await mongoose.connect(process.env.MONGO_uri);

const hashedPassword = await bcrypt.hash("admin123", 10);

await Admin.create({
    email: "admin@clipgrooming.com",
    password: hashedPassword,
});

console.log("Admin created");
process.exit();