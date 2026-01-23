import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserAuth } from "../modules/auth/store/store";

export default function ProtectedRoutes() {
	const { user, token, isHydrated } = UserAuth();
	const location = useLocation();

	if (!isHydrated) {
		return null;
	}

	if (!token || !user) {
		return <Navigate to="/login" replace />;
	}

	console.log(token);
	console.log(user);

	if (location.pathname === "/dashboard") {
		if (user.role === "admin") {
			return <Navigate to="/admin/dashboard" replace />;
		}

		if (user.role === "superadmin") {
			return <Navigate to="/superadmin/dashboard" replace />;
		}

		if (user.role === "developers") {
			return <Navigate to="/developers/dashboard" replace />;
		}
	}

	return <Outlet />;
}
