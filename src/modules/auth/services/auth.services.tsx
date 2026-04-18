import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
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
		const res = await api.post(API_ENDPOINTS.AUTH.REGISTER_ADMIN, data);
		return res.data;
	},

	async verifyOtp(data: VerifyOtpRequest) {
		const res = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
		return res.data;
	},

	async Login(data: LoginRequest) {
		const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
		return res.data;
	},
	async verifyForgotOtp(data: { email: string; otp: string }) {
		const res = await api.post(API_ENDPOINTS.AUTH.VERIFY_FORGOT_OTP, data);
		return res.data;
	},

	async ResendOtp(data: ResendOtpRequest) {
		const res = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, data);
		return res.data;
	},

	async ResetPassword(data: ResetPasswordRequest) {
		const res = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
		return res.data;
	},
	async ForgotPassword(data: ForgotPasswordRequest) {
		const res = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD_POST, data);
		return res.data;
	},
	async Logout(data: LoginRequest) {
		const res = await api.post(API_ENDPOINTS.AUTH.LOGOUT, data);
		return res.data;
	},
	async getMe() {
		const res = await api.get(API_ENDPOINTS.AUTH.ME);
		return res.data;
	},
	async forgotPassword() {
		const res = await api.get(API_ENDPOINTS.AUTH.FORGOT_PASSWORD_GET);
		return res.data;
	},
};
