import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.services";
import type { RegisterRequest } from "../types/types";

export function useRegister() {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (data: RegisterRequest) => authService.Register(data),

		onSuccess: (res) => {
			toast.success("OTP sent successfully");

			localStorage.setItem("otp_token", res.data.token);

			navigate("/otp", { replace: true });
		},
		onError: (err: any) => {
			toast.error(err.response?.data?.message || "Registration failed");
		},
	});
}
