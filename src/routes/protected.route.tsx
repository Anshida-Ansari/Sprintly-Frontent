import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetMe } from "../modules/auth/hooks/useGetMe";
import { UserAuth } from "../modules/auth/store/store";
import { AiChatbot } from "../shared/components/AiChatbot";

export default function ProtectedRoutes() {
	const { user, token, isHydrated } = UserAuth();
	const location = useLocation();

	// Always sync the latest user data (incl. companyId) from the backend
	useGetMe();

	if (!isHydrated) {
		return null;
	}

	if (!token || !user) {
		return <Navigate to="/login" replace />;
	}

	if (location.pathname === "/dashboard") {
		if (user.role === "admin" || user.role === "lead") {
			return <Navigate to="/admin/dashboard" replace />;
		}

		if (user.role === "superadmin") {
			return <Navigate to="/superadmin/dashboard" replace />;
		}

		if (user.role === "developers") {
			return <Navigate to="/developers/dashboard" replace />;
		}
	}

	return (
		<>
			<Outlet />
			<AiChatbot />
		</>
	);
}
