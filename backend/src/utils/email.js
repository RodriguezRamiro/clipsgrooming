/* //backend/src/utils/email.js */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export async function sendCustomerConfirmation(booking) {
    await transporter.sendMail({
        from: `"Clip Grooming" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: "Your Appointment is Confirmed ✂️",
        html: `
        <h2>Appointment Confirmed</h2>
        <p>Hi ${booking.name}, </p>
        <p>Your appointment has been successfully booked.</p>

        <ul>
            <li><strong>Date:</strong>${booking.date}</li>
            <li><strong>Time:</strong> ${booking.time}</li>
            <li><strong>Service:</strong>${booking.service}</li>
        </ul>

        <p>We look forward to seeing you!</p>
        `

    });
}

export async function sendAdminNotification(booking) {
    await transporter.sendMail({
        from: `"Clip Grooming" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "New Paid Booking Received",
        html: `
        <h2>New Booking</h2>
        <ul>
            <li>Name: ${booking.name}</li>
            <li>Email: ${booking.email}</li>
            <li>Date: ${booking.date}</li>
            <li>Time: ${booking.time}</li>
            <li>Service: ${booking.service}</li>
        </ul>
        `
    });
}