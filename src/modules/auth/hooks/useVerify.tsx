import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.services";
import { UserAuth } from "../store/store";
import type { VerifyOtpRequest } from "../types/types";

export function useVerifyOtp() {
	const navigate = useNavigate();
	const login = UserAuth((s) => s.login);

	return useMutation({
		mutationFn: (data: VerifyOtpRequest) => authService.verifyOtp(data),

		onSuccess: (res) => {
			toast.success("OTP verified");

			login(res.user, res.accessToken);

			localStorage.removeItem("otp_token");

			navigate("/dashboard", { replace: true });
		},

		onError: (err: any) => {
			toast.error(err.response?.data?.message || "Invalid OTP");
		},
	});
}
