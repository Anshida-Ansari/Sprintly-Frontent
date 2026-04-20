import { Bell, Fingerprint, Globe, Mail, Settings, Shield } from "lucide-react";

export default function SuperAdminSettings() {
	const settings = [
		{
			id: 1,
			name: "General Settings",
			icon: Globe,
			description: "Platform name, logo, and timezone.",
		},
		{
			id: 2,
			name: "Authentication",
			icon: Fingerprint,
			description: "Manage login methods, MFA, and session timeouts.",
		},
		{
			id: 3,
			name: "Email Notifications",
			icon: Mail,
			description: "Configure SMTP settings and platform email templates.",
		},
		{
			id: 4,
			name: "Security & Permissions",
			icon: Shield,
			description: "Define SuperAdmin roles and API access levels.",
		},
		{
			id: 5,
			name: "System Alerts",
			icon: Bell,
			description: "Setup monitoring alerts for server and database health.",
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
				<p className="text-gray-500 mt-1">
					Manage global configurations and security policies.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{settings.map((item) => (
					<div
						key={item.id}
						className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
					>
						<div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors">
							<item.icon size={24} />
						</div>
						<div className="mt-4">
							<h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
							<p className="text-sm text-gray-500 mt-1 leading-relaxed">
								{item.description}
							</p>
						</div>
						<div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:underline">
							Manage Settings <Settings size={14} />
						</div>
					</div>
				))}
			</div>

			<div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-lg shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
				<div className="space-y-2">
					<h2 className="text-2xl font-bold">
						Need help with platform configuration?
					</h2>
					<p className="text-indigo-100">
						Check our system documentation for advanced setup guides.
					</p>
				</div>
				<button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors whitespace-nowrap">
					View Documentation
				</button>
			</div>
		</div>
	);
}
