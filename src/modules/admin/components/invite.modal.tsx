import { X } from "lucide-react";
import { useState } from "react";

interface InviteMemberModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: { name: string; email: string; role: string }) => void;
	isLoading?: boolean;
}

export default function InviteMemberModal({
	isOpen,
	onClose,
	onSubmit,
	isLoading = false,
}: InviteMemberModalProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("developers");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !email.trim()) return;
		onSubmit({ name: name.trim(), email: email.trim(), role });
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Overlay */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
				onClick={onClose}
			/>

			{/* Modal Card */}
			<div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
				<div className="p-8">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-900">
							Invite Team Member
						</h2>
						<button
							onClick={onClose}
							className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
							disabled={isLoading}
						>
							<X size={20} className="text-gray-500" />
						</button>
					</div>

					{/* Description */}
					<p className="text-gray-600 mb-6">
						They'll receive an email with a link to set their password and join
						your team.
					</p>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								placeholder="John Doe"
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
								disabled={isLoading}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								placeholder="john@company.com"
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
								disabled={isLoading}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Role
							</label>
							<select
								value={role}
								onChange={(e) => setRole(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
								disabled={isLoading}
							>
								<option value="developers">Developer</option>
								<option value="lead">Lead</option>
							</select>
						</div>

						{/* Footer Buttons */}
						<div className="flex gap-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								disabled={isLoading}
								className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isLoading || !name.trim() || !email.trim()}
								className="flex-1 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
							>
								{isLoading ? (
									<>
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Sending...
									</>
								) : (
									"Send Invite"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
