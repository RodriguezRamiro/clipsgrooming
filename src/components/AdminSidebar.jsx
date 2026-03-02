/* //src/components/AdminSidebar.jsx */

import { NavLink } from "react-router-dom";

export default function AdminSidebar() {

    return (
        <aside className="admin-sidebar">
            <div className="admin-logo">
                <h2>Clip Grooming</h2>
                <span>Admin</span>
            </div>

            <nav className="admin-nav">
                <NavItem to="/admin" label="Dashboard" icon="📊" />
                <NavItem to="/admin/bookings" label="Bookings" icon="📅" />
                <NavItem to="/adminpayments" label="Payments" icon="💳" />
                <NavItem to="/admin/refunds" label="Refunds" icon="↩️" />
                <NavItem to="/admin/settings" label="Settings" icon="⚙️" />
            </nav>

            <div className="admin-footer">
                <button className="logout-btn">🚪 Logout</button>
            </div>
            </aside>
            );
    }
function NavItems({ to, label, icon }) {
    return (
        <NavLink
        to={to}
        end
        className={({ isActive }) =>
    `admin-link ${isActive ? "active" : ""}`
}
>
    <span className="icon">{icon}</span>
    {label}
</NavLink>
    );
}