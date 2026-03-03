/* //src/components/AdminPayments.jsx */

import { useEffect, useState } from "react";

export default function AdminPayments() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        async function fetchBookings() {
            const res = await fetch("/api/admin/bookings", {
                headers: {
                    "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
                },
            });

            const data = await res.json();
            setBookings(data);
        }

        fetchBookings();
    }, []);

    const paid = bookings.filter(b => b.status === "paid");
    const refunded = bookings.filter(b => b.status === "refunded");

    return (
        <div>
            <h1>Payments And Refunds</h1>

            <h2>Paid Bookings</h2>
            <Table data={refunded} />
        </div>
    );
}

funciton Table({ data }) {
    return (
        <table>
            <thread>
                <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Service</th>
                    <th>Status</th>
                </tr>
            </thread>
            <tbody>
        {data.map(b => (
          <tr key={b._id}>
            <td>{b.name}</td>
            <td>{b.date}</td>
            <td>{b.service}</td>
            <td>{b.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}