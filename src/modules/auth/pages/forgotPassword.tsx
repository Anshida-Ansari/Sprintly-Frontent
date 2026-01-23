import { ArrowRight, ChevronLeft, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../hooks/useForgetPassword";

export default function ForgotPassword() {
	const { mutate: forgotPassword, isPending } = useForgotPassword();
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		localStorage.setItem("forgot_email", email);
		forgotPassword({ email });
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
					to="/login"
					className="flex items-center gap-2 text-sm font-bold border-b-2 border-blue-600 pb-1 hover:text-blue-600 transition-colors"
				>
					<ChevronLeft size={14} />
					BACK TO LOGIN
				</Link>
			</nav>

			<main className="flex-1 flex items-center justify-center p-6">
				<div className="w-full max-w-[480px]">
					{/* Bold Heading Section */}
					<div className="mb-12 space-y-4">
						<div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
							<Mail size={14} className="text-blue-600" />
							<span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
								Recovery System
							</span>
						</div>
						<h1 className="text-5xl font-black tracking-tight leading-[0.9]">
							FORGOT <span className="text-blue-600">ACCESS?</span>
							<br />
							RESET KEY.
						</h1>
						<p className="text-slate-500 font-medium text-lg max-w-[340px]">
							Enter your identity below and we'll send recovery instructions.
						</p>
					</div>

					{/* Modern Form */}
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="group relative border-2 border-slate-100 rounded-2xl p-4 focus-within:border-blue-600 transition-all duration-300">
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 mb-1">
								Email Address
							</p>
							<input
								name="email"
								type="email"
								placeholder="name@company.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-200"
							/>
						</div>

						<button
							type="submit"
							disabled={isPending}
							className="w-full h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-between px-8 hover:bg-blue-600 transition-all duration-300 group shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-50"
						>
							<span className="font-black text-xl tracking-tight">
								{isPending ? "SENDING..." : "SEND OTP"}
							</span>
							{isPending ? (
								<Loader2 className="animate-spin" size={24} />
							) : (
								<ArrowRight
									size={24}
									className="group-hover:translate-x-2 transition-transform"
								/>
							)}
						</button>
					</form>

					{/* Minimal Footer Info */}
					<div className="mt-12 pt-8 border-t border-slate-50 flex items-center gap-8 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
						<span>EST. 2024</span>
						<span>Secure Protocol</span>
						<div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
						<span className="text-emerald-500">System Live</span>
					</div>
				</div>
			</main>
		</div>
	);
}
