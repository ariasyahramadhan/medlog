import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/401" replace />;
    }

    return <Outlet />;
}
