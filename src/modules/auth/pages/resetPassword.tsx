import { ArrowRight, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useResetPassword } from "../hooks/useResetPassword";

export default function ResetPassword() {
	const { mutate: resetPassword, isPending } = useResetPassword();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		newPassword: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const email = localStorage.getItem("forgot_email");

	useEffect(() => {
		if (!email) {
			toast.error("No identity found. Please start over.");
			navigate("/forgot-password");
		}
	}, [email, navigate]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.newPassword !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		resetPassword({
			email: email!,
			newPassword: formData.newPassword,
			confirmPassword: formData.confirmPassword,
		});
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
					className="text-sm font-bold border-b-2 border-blue-600 pb-1 hover:text-blue-600 transition-colors uppercase tracking-widest"
				>
					Cancel Reset
				</Link>
			</nav>

			<main className="flex-1 flex items-center justify-center p-6">
				<div className="w-full max-w-[480px]">
					{/* Bold Heading Section */}
					<div className="mb-12 space-y-4">
						<div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
							<KeyRound size={14} className="text-blue-600" />
							<span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
								Security Override
							</span>
						</div>
						<h1 className="text-5xl font-black tracking-tight leading-[0.9]">
							NEW <span className="text-blue-600">KEY.</span>
							<br />
							SECURE ACCESS.
						</h1>
						<p className="text-slate-500 font-medium text-lg max-w-[340px]">
							Update credentials for{" "}
							<span className="text-slate-900 font-bold">{email}</span>.
						</p>
					</div>

					{/* Modern Form */}
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* New Password Input */}
						<div className="group relative border-2 border-slate-100 rounded-2xl p-4 focus-within:border-blue-600 transition-all duration-300">
							<div className="flex justify-between items-center mb-1">
								<p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600">
									New Access Key
								</p>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="text-slate-400 hover:text-blue-600 transition-colors"
								>
									{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
								</button>
							</div>
							<input
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={formData.newPassword}
								onChange={(e) =>
									setFormData({ ...formData, newPassword: e.target.value })
								}
								required
								className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-200"
							/>
						</div>

						{/* Confirm Password Input */}
						<div className="group relative border-2 border-slate-100 rounded-2xl p-4 focus-within:border-blue-600 transition-all duration-300">
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 mb-1">
								Confirm Access Key
							</p>
							<input
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={formData.confirmPassword}
								onChange={(e) =>
									setFormData({ ...formData, confirmPassword: e.target.value })
								}
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
								{isPending ? "UPDATING..." : "UPDATE PASSWORD"}
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
						<span>AES-256</span>
						<div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
						<span className="text-emerald-500">System Live</span>
					</div>
				</div>
			</main>
		</div>
	);
}
