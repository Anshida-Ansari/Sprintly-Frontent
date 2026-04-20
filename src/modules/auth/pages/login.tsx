import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Fingerprint, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { type LoginFormData, loginSchema } from "../schemas/auth.schemas";

export default function Login() {
	const { mutate: login, isPending } = useLogin();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data: LoginFormData) => {
		login(data);
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
					to="/register"
					className="text-sm font-bold border-b-2 border-blue-600 pb-1 hover:text-blue-600 transition-colors"
				>
					CREATE ACCOUNT
				</Link>
			</nav>

			<main className="flex-1 flex items-center justify-center p-6">
				<div className="w-full max-w-[480px]">
					{/* Bold Heading Section */}
					<div className="mb-12 space-y-4">
						<div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
							<Fingerprint size={14} className="text-blue-600" />
							<span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
								Secure Access v2
							</span>
						</div>
						<h1 className="text-5xl font-black tracking-tight leading-[0.9]">
							WORK <span className="text-blue-600">FASTER.</span>
							<br />
							CODE BETTER.
						</h1>
						<p className="text-slate-500 font-medium text-lg max-w-[320px]">
							The command center for your next big release.
						</p>
					</div>

					{/* Standard but Modern Form */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4"
						noValidate
					>
						<div
							className={`group relative border-2 ${errors.email ? "border-red-500" : "border-slate-100"} rounded-2xl p-4 focus-within:border-${errors.email ? "red" : "blue"}-600 transition-all duration-300`}
						>
							<p
								className={`text-[10px] font-black uppercase tracking-widest ${errors.email ? "text-red-600" : "text-slate-400 group-focus-within:text-blue-600"} mb-1`}
							>
								Identity
							</p>
							<input
								{...register("email")}
								placeholder="name@company.com"
								className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-200"
							/>
						</div>
						{errors.email && (
							<p className="text-red-500 text-xs mt-1 font-medium -mt-3">
								{errors.email.message}
							</p>
						)}

						<div
							className={`group relative border-2 ${errors.password ? "border-red-500" : "border-slate-100"} rounded-2xl p-4 focus-within:border-${errors.password ? "red" : "blue"}-600 transition-all duration-300`}
						>
							<div className="flex justify-between items-center mb-1">
								<p
									className={`text-[10px] font-black uppercase tracking-widest ${errors.password ? "text-red-600" : "text-slate-400 group-focus-within:text-blue-600"}`}
								>
									Access Key
								</p>
								<Link
									to="/forgot-password"
									className="text-[10px] font-bold text-slate-300 hover:text-blue-600"
								>
									FORGOT?
								</Link>
							</div>
							<input
								{...register("password")}
								type="password"
								placeholder="••••••••"
								className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-200"
							/>
						</div>
						{errors.password && (
							<p className="text-red-500 text-xs mt-1 font-medium -mt-3">
								{errors.password.message}
							</p>
						)}

						<button
							type="submit"
							disabled={isPending}
							className="w-full h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-between px-8 hover:bg-blue-600 transition-all duration-300 group shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-50"
						>
							<span className="font-black text-xl tracking-tight">LOG IN</span>
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
						<span>Open Source</span>
						<div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
						<span className="text-emerald-500">System Live</span>
					</div>
				</div>
			</main>
		</div>
	);
}
