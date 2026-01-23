import { ArrowRight, ChevronLeft, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import OtpInput, { type OtpInputRef } from "../components/Otp/Otp.input";
import { useResendOtp } from "../hooks/useResendotp";
import { useVerifyForgotOtp } from "../hooks/useVerifyForgotOtp";

const RESEND_COOLDOWN_SECONDS = 30;

const ForgotPasswordOtpPage = () => {
	const [otpValue, setOtpValue] = useState("");
	const [error, setError] = useState("");
	const [canResend, setCanResend] = useState(false);
	const otpInputRef = useRef<OtpInputRef>(null);
	const navigate = useNavigate();

	const email = localStorage.getItem("forgot_email");

	const { mutate: verifyOtp, isPending: isVerifying } = useVerifyForgotOtp();
	const { mutate: resendOtp, isPending: isResending } = useResendOtp();

	useEffect(() => {
		if (!email) {
			toast.error("No identity found. Please restart.");
			navigate("/forgot-password");
		}
	}, [email, navigate]);

	useEffect(() => {
		const cooldownTimer = setTimeout(() => {
			setCanResend(true);
		}, RESEND_COOLDOWN_SECONDS * 1000);

		return () => clearTimeout(cooldownTimer);
	}, []);

	const handleSubmit = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (otpValue.length !== 6) {
			setError("Enter all 6 digits");
			return;
		}

		verifyOtp(
			{ email: email!, otp: otpValue },
			{
				onError: (err: any) => {
					setError(err.response?.data?.message || "Invalid security code");
					otpInputRef.current?.clear();
				},
			},
		);
	};

	const handleResend = () => {
		if (!email || !canResend) return;
		resendOtp(
			{ email },
			{
				onSuccess: () => {
					toast.success("New code dispatched");
					setCanResend(false);
					setTimeout(() => setCanResend(true), RESEND_COOLDOWN_SECONDS * 1000);
				},
			},
		);
	};

	return (
		<div className="min-h-screen w-full bg-white flex flex-col font-sans antialiased text-slate-900">
			{/* Top Navigation Bar */}
			<nav className="p-8 flex justify-between items-center w-full max-w-7xl mx-auto">
				<div className="flex items-center gap-2">
					<span className="font-black text-2xl tracking-tighter text-slate-900">
						Sprintly<span className="text-blue-600">.</span>
					</span>
				</div>
				<Link
					to="/forgot-password"
					className="flex items-center gap-2 text-sm font-bold border-b-2 border-blue-600 pb-1 hover:text-blue-600 transition-colors"
				>
					<ChevronLeft size={14} />
					CHANGE EMAIL
				</Link>
			</nav>

			<main className="flex-1 flex items-center justify-center p-6">
				<div className="w-full max-w-[480px]">
					{/* Bold Heading Section */}
					<div className="mb-12 space-y-4">
						<div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
							<ShieldCheck size={14} className="text-blue-600" />
							<span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
								Identity Verification
							</span>
						</div>
						<h1 className="text-5xl font-black tracking-tight leading-[0.9]">
							CHECK YOUR <span className="text-blue-600">INBOX.</span>
							<br />
							VERIFY CODE.
						</h1>
						<p className="text-slate-500 font-medium text-lg max-w-[360px]">
							Sent to <span className="text-slate-900 font-bold">{email}</span>.
							Enter the 6-digit access key below.
						</p>
					</div>

					{/* OTP Input Container */}
					<div className="space-y-8">
						<div className="flex flex-col items-center">
							<OtpInput
								onChange={(val) => {
									setOtpValue(val);
									setError("");
								}}
								error={!!error}
								ref={otpInputRef}
							/>
							{error && (
								<p className="mt-4 text-xs font-black uppercase tracking-widest text-red-500">
									{error}
								</p>
							)}
						</div>

						<button
							onClick={() => handleSubmit()}
							disabled={isVerifying || otpValue.length !== 6}
							className="w-full h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-between px-8 hover:bg-blue-600 transition-all duration-300 group shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-50"
						>
							<span className="font-black text-xl tracking-tight">
								{isVerifying ? "VERIFYING..." : "VERIFY CODE"}
							</span>
							{isVerifying ? (
								<Loader2 className="animate-spin" size={24} />
							) : (
								<ArrowRight
									size={24}
									className="group-hover:translate-x-2 transition-transform"
								/>
							)}
						</button>

						<div className="flex items-center justify-between">
							<p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
								Didn't get it?
							</p>
							<button
								onClick={handleResend}
								disabled={!canResend || isResending}
								className="text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 disabled:text-slate-300 transition-colors"
							>
								{isResending
									? "SENDING..."
									: canResend
										? "RESEND NOW"
										: `RESEND IN ${RESEND_COOLDOWN_SECONDS}S`}
							</button>
						</div>
					</div>

					{/* Minimal Footer Info */}
					<div className="mt-12 pt-8 border-t border-slate-50 flex items-center gap-8 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
						<span>EST. 2024</span>
						<span>MFA Protected</span>
						<div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
						<span className="text-emerald-500">System Live</span>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ForgotPasswordOtpPage;
