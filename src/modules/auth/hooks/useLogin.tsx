import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.services";
import { UserAuth } from "../store/store";
import type { LoginRequest } from "../types/types";

export function useLogin() {
	const navigate = useNavigate();
	const loginUser = UserAuth((s) => s.login);

	return useMutation({
		mutationFn: (data: LoginRequest) => authService.Login(data),

		onSuccess: (res) => {
			const { user, accessToken } = res.data;

			loginUser(user, accessToken);

			toast.success("Login successful");

			switch (user.role) {
				case "admin":
				case "lead":
					navigate("/admin/dashboard", { replace: true });
					break;
				case "superadmin":
					navigate("/superadmin/dashboard", { replace: true });
					break;
				case "developers":
					navigate("/developers/dashboard", { replace: true });
					break;
				default:
					navigate("/", { replace: true });
			}
		},

		onError: (err: any) => {
			toast.error(err.response?.data?.message || "Login failed");
		},
	});
}
