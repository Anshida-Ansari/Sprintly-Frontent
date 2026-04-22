// pages/OtpPage.tsx
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OtpInput, { type OtpInputRef } from "../components/Otp/Otp.input";
import { useResendOtp } from "../hooks/useResendotp"; // ← add this
import { useVerifyOtp } from "../hooks/useVerify";

const OTP_EXPIRY_MINUTES = 3;
const RESEND_COOLDOWN_SECONDS = 30;

const OtpPage = () => {
	const [otpValue, setOtpValue] = useState("");
	const [error, setError] = useState("");
	const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_MINUTES * 60); // seconds
	const [canResend, setCanResend] = useState(false);

	const otpInputRef = useRef<OtpInputRef>(null);
	const navigate = useNavigate();

	const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
	const { mutate: resendOtp, isPending: isResending } = useResendOtp();

	const token = localStorage.getItem("otp_token");

	useEffect(() => {
		if (!token) {
			toast.error("OTP session expired. Please register again.");
			navigate("/login", { replace: true });
			return;
		}
	}, [token, navigate]);

	// Countdown timer
	useEffect(() => {
		if (!token || timeLeft <= 0) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [token, timeLeft]);

	// Enable resend after cooldown
	useEffect(() => {
		const cooldownTimer = setTimeout(() => {
			setCanResend(true);
		}, RESEND_COOLDOWN_SECONDS * 1000);

		return () => clearTimeout(cooldownTimer);
	}, []);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleSubmit = () => {
		if (otpValue.length !== 6) {
			setError("Please enter all 6 digits");
			return;
		}

		verifyOtp(
			{ token: token!, otp: otpValue },
			{
				onError: (err: any) => {
					const message =
						err.response?.data?.message || "Invalid or expired OTP";
					setError(message);
					otpInputRef.current?.clear();
				},
			},
		);
	};

	const handleResend = () => {
		if (!canResend || !token) {
			return;
		}

		resendOtp(
			{ token },
			{
				onSuccess: () => {
					toast.success("New OTP sent!");
					setError("");
					otpInputRef.current?.clear();
					setOtpValue("");
					// Reset timer to full 3 minutes
					setTimeLeft(OTP_EXPIRY_MINUTES * 60);
					// Disable resend again for 30 seconds
					setCanResend(false);
					setTimeout(() => setCanResend(true), RESEND_COOLDOWN_SECONDS * 1000);
				},
				onError: () => {
					toast.error("Failed to resend OTP");
				},
			},
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
			{/* Logo */}
			<div className="absolute top-6 left-6">
				<div className="flex items-center gap-2">
					<div className="text-indigo-600 text-2xl font-bold">&lt;/&gt;</div>
					<span className="text-2xl font-bold text-gray-800">Sprintly</span>
				</div>
			</div>

			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Verify Your Account
					</h1>
					<p className="text-gray-600">
						We've sent a 6-digit code to your email.
						<br />
						Enter it below to continue.
					</p>
				</div>

				<div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
					<OtpInput
						onChange={(val) => {
							setOtpValue(val);
							setError("");
						}}
						error={!!error}
						ref={otpInputRef}
					/>

					{error && (
						<div className="mt-4 text-center text-sm text-red-600">{error}</div>
					)}

					{/* Timer Display */}
					<div className="text-center mt-4 text-sm">
						<span className="text-gray-600">OTP expires in </span>
						<span
							className={`font-semibold ${timeLeft < 60 ? "text-red-600" : "text-indigo-600"}`}
						>
							{formatTime(timeLeft)}
						</span>
					</div>

					<button
						onClick={handleSubmit}
						disabled={isVerifying || otpValue.length !== 6}
						className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isVerifying ? (
							<>
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Verifying...
							</>
						) : (
							"Verify OTP"
						)}
					</button>
				</div>

				{/* Resend Section */}
				<div className="text-center">
					<p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
					<button
						onClick={handleResend}
						disabled={!canResend || isResending}
						className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
					>
						{isResending
							? "Sending..."
							: canResend
								? "Resend OTP"
								: `Resend in ${RESEND_COOLDOWN_SECONDS}s`}
					</button>
				</div>

				{/* Security Note */}
				<div className="mt-8 flex items-start gap-2 text-xs text-gray-500">
					<svg
						className="w-4 h-4 mt-0.5 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Security Lock Icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
					<p>
						Your security is our priority. This code is valid for 3 minutes.
					</p>
				</div>
			</div>
		</div>
	);
};

export default OtpPage;
