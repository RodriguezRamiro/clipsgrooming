import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns"
import enUS from "date-fns/locale/en-US";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function AdminCalendar() {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {

        const token = localStorage.getItem("adminToken");
        console.log("admintoken", token)

        const res = await fetch("/api/admin/bookings", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });


        const data = await res.json();
        if (!Array.isArray(data)) {
            console.error("Admin bookings API error:", data);
            return
        }

        const events = data.map(b => {

            const start = new Date(`${b.date} ${b.time}`);
            const duration = b.duration || 60
            const end = new Date(start.getTime() + duration * 60000);

            return {
                title: `${b.client?.name || "Client" } - ${b.service}`,
                start,
                end,
                status: b.status,
            };
        });

        setEvents(events)
    }

    return (
        <div className="admin-calendar">
            <h1>Booking Calendar</h1>

            <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650}}
            />
        </div>
    );
}
