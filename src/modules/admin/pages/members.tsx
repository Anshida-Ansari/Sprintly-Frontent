import {
	ArrowRight,
	CheckCircle2,
	Loader2,
	Mail,
	User,
	UserPlus,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useInviteMember } from "../hooks/useInviteMember";

export default function AdminInviteMemberPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");


	const mutation = useInviteMember();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(
			{ name, email, role: "developers" },
			{
				onSuccess: () => {
					toast.success(`Invitation sent to ${name}`);
					setName("");
					setEmail("");
				},
				onError: () => {
					toast.error("Failed to send invitation");
				},
			},
		);
	};

	return (
		<div className="max-w-4xl mx-auto mt-10">
			{/* Header Section */}
			<div className="mb-8 text-center md:text-left">
				<h1 className="text-3xl font-black text-gray-900 tracking-tight">
					Expand Your Team
				</h1>
				<p className="text-gray-500 font-medium mt-1">
					Invite new members to collaborate on your projects.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
				{/* Form Card */}
				<div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
								<User size={16} className="text-indigo-500" /> Full Name
							</label>
							<div className="relative group">
								<input
									type="text"
									placeholder="e.g. Jane Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									className="w-full pl-4 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-gray-900 font-medium"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
								<Mail size={16} className="text-indigo-500" /> Email Address
							</label>
							<div className="relative group">
								<input
									type="email"
									placeholder="jane@company.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-full pl-4 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-gray-900 font-medium"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={mutation.isPending}
							className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed group"
						>
							{mutation.isPending ? (
								<>
									<Loader2 className="animate-spin" size={20} />
									Sending Invitation...
								</>
							) : (
								<>
									Send Invitation
									<ArrowRight
										size={20}
										className="group-hover:translate-x-1 transition-transform"
									/>
								</>
							)}
						</button>
					</form>
				</div>

				{/* Info/Status Card (The "Why" Section) */}
				<div className="lg:col-span-2 space-y-4">
					<div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 relative overflow-hidden">
						<div className="relative z-10">
							<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
								<UserPlus size={24} />
							</div>
							<h3 className="text-indigo-900 font-bold text-lg mb-2">
								Member Role
							</h3>
							<p className="text-indigo-700/80 text-sm leading-relaxed font-medium">
								New members will be invited as <strong>Collaborators</strong>.
								They will be able to join projects and participate in sprints
								once they accept the email.
							</p>
						</div>
						{/* Decorative Icon */}
						<UserPlus
							size={120}
							className="absolute -bottom-6 -right-6 text-indigo-200 opacity-30 rotate-12"
						/>
					</div>

					<div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
						<div className="flex items-center gap-3 text-emerald-700 font-bold mb-3">
							<CheckCircle2 size={20} />
							<span className="text-sm">Team Benefits</span>
						</div>
						<ul className="space-y-2">
							{["Unlimited Projects", "Sprint Access", "Task Assignment"].map(
								(text, i) => (
									<li
										key={i}
										className="text-emerald-700/70 text-xs font-bold flex items-center gap-2"
									>
										<div className="w-1 h-1 bg-emerald-400 rounded-full" />
										{text}
									</li>
								),
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
