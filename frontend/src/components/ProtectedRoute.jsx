import { Navigate } from "react-router-dom";

function ProtectedRoute({
    children,
    allowedRole,
}) {
    const accessToken =
        localStorage.getItem("accessToken");

    const userRole =
        localStorage.getItem("userRole");

    // User is not logged in
    if (!accessToken) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Logged-in user has the wrong role
    if (
        allowedRole &&
        userRole !== allowedRole
    ) {
        if (userRole === "recruiter") {
            return (
                <Navigate
                    to="/recruiter/dashboard"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;