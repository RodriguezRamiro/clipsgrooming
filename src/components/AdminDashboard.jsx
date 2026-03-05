/* src/components/AdminDashboard.jsx */

import AdminSidebar from "../components/AdminSidebar.jsx";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <AdminSidebar />

            <div className="admin-main">
            {/* <AdminTopBar /> */}

            <div className="admin-content">
                {/* Nested admin pages render here */}
                <Outlet />
                </div>
            </div>
        </div>
    );
}