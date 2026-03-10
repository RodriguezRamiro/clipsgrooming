/* //src/components/AdminHome.jsx */

import { useEffect, useState } from "react";


export default function AdminHome() {

    const token = localStorage.getItem("adminToken");

    const [stats, setStats] = useState({
        total: 0,
        paid: 0,
        pending: 0,
        refunded: 0,
    });

    const [bookings, setBoookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        if (!token) {
            console.error("No admin token found");
            return;
        }

        const res = await fetch("/api/admin/bookings", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("Unexpected API response:", data);
            return;
        }

        setBoookings(data);

        setStats({
            total: data.length,
            paid: data.filter(b => b.status === "paid").length,
            pending: data.filter(b => b.status === "reserved").length,
            refunded: data.filter(b => b.status === "refunded").length,
        });
    }

    async function cancelBooking(id) {
        await fetch(`/api/admin/bookings/${id}/cancel`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        fetchBookings();
    }

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>

            <div className="stats-grid">
                <StatCard label="Total Bookings" value={stats.total} />
                <StatCard label="Paid" value={stats.paid} />
                <StatCard label="Reserved" value={stats.pending} />
                <StatCard label="Refunded" value={stats.refunded} />
            </div>

            <h2 style={{ marginTop: "40px" }}>Bookings</h2>

            <table className="bookings-table">
                <thread>
                    <tr>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Customer</th>
                        <th>Actions</th>
                    </tr>
                </thread>

                <tbody>
                    {bookings.map(b => (
                    <tr key={b._id}>
                        <td>{b.client?.name || "N/A"}</td>
                        <td>{b.service}</td>
                        <td>{b.date}</td>
                        <td>{b.time}</td>
                        <td>{b.status}</td>

                        <td>
                            {b.status === "reserved" && (
                                <button onClick={() => cancelBooking(b._id)}>
                                    Cancel
                                </button>
                            )}

                            {b.status === "paid" && (
                                <button onClick={() => refundBooking(b._id)}>
                                    Refund
                                </button>
                            )}
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="stats-card">
            <h3>{label}</h3>
            <p>{value}</p>

        </div>
    );
}