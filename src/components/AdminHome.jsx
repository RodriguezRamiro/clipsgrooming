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

    useEffect(() => {
        async function fetchStats() {

            if (!token) {
                console.error("No admin token found");
                return
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

            setStats({
                total: data.length,
                paid: data.filter(b => b.status === "paid").length,
                pending: data.filter(b => b.status === "pending").length,
                refunded: data.filter(b => b.status === "refunded").length,
            });
        }

    });

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <div className="stats-grid">
                <StatCard label="Total Bookings" value={stats.total} />
                <StatCard label="Paid" value={stats.paid} />
                <StatCard label="Pending" value={stats.pending} />
                <StatCard label="Refunded" value={stats.refunded} />
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="stat-card">
            <h3>{label}</h3>
            <p>{value}</p>
        </div>
    );
}