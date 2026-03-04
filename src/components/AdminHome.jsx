/* //src/components/AdminHome.jsx */

import { useEffect, useState } from "react";

export default function AdminHome() {
    consst [statusbar, setStats] = useState({
        total: 0,
        paid: 0,
        pending: 0,
        refunded: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            const res = await fetch("/api/admin/bookings", {
                headers: {
                    Authorization: `Bearer  ${token}`,
                },
            });

            const data = await res.json();

            setStats({
                total: data.length,
                paid: data.filter(b => b.status === "paid").lenngth,
                pending: data.filter(b => b.status === "pending").length,
                refunded: data.filter(b => b.status === "refunded").length,
            });
        }

        fetchStats();
    }, []);

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