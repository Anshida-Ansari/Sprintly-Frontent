import api from "../../../lib/axios.user";
import type {
	ForgotPasswordRequest,
	LoginRequest,
	RegisterRequest,
	ResendOtpRequest,
	ResetPasswordRequest,
	VerifyOtpRequest,
} from "../types/types";

export const authService = {
	async Register(data: RegisterRequest) {
		const res = await api.post("auth/admin/register", data);
		return res.data;
	},

	async verifyOtp(data: VerifyOtpRequest) {
		const res = await api.post("/auth/verify-otp", data);
		return res.data;
	},

	async Login(data: LoginRequest) {
		const res = await api.post("/auth/login", data);
		return res.data;
	},
	async verifyForgotOtp(data: { email: string; otp: string }) {
		const res = await api.post("/auth/verify-forgot-otp", data);
		return res.data;
	},

	async ResendOtp(data: ResendOtpRequest) {
		const res = await api.post("/auth/resend-otp", data);
		return res.data;
	},

	async ResetPassword(data: ResetPasswordRequest) {
		const res = await api.post("/auth/reset-password", data);
		return res.data;
	},
	async ForgotPassword(data: ForgotPasswordRequest) {
		const res = await api.post("/auth/forgot-password", data);
		return res.data;
	},
	async Logout(data: LoginRequest) {
		const res = await api.post("/auth/logout", data);
		return res.data;
	},
	async getMe() {
		const res = await api.get("/auth/me");
		return res.data;
	},
	async forgotPassword() {
		const res = await api.get("/forgot-password");
		return res.data;
	},
};
