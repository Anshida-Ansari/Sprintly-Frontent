import { AlertCircle, ShieldCheck, Terminal } from "lucide-react";

export default function SuperAdminLogs() {
	const logs = [
		{
			id: 1,
			event: "New Company Registered",
			user: "system",
			timestamp: "2 mins ago",
			type: "success",
		},
		{
			id: 2,
			event: "Database Backup Completed",
			user: "system",
			timestamp: "1 hour ago",
			type: "success",
		},
		{
			id: 3,
			event: "Failed Login Attempt",
			user: "admin@unknown.com",
			timestamp: "2 hours ago",
			type: "warning",
		},
		{
			id: 4,
			event: "New SuperAdmin Invite Sent",
			user: "master_admin",
			timestamp: "5 hours ago",
			type: "info",
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
				<p className="text-gray-500 mt-1">
					Monitor platform activities and security events.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
					<div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
						<Terminal size={24} />
					</div>
					<div>
						<p className="text-sm text-gray-500 font-medium">Total Events</p>
						<p className="text-2xl font-bold text-gray-900">1,284</p>
					</div>
				</div>
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
					<div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
						<ShieldCheck size={24} />
					</div>
					<div>
						<p className="text-sm text-gray-500 font-medium">Security Alerts</p>
						<p className="text-2xl font-bold text-gray-900">0</p>
					</div>
				</div>
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
					<div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
						<AlertCircle size={24} />
					</div>
					<div>
						<p className="text-sm text-gray-500 font-medium">Warnings</p>
						<p className="text-2xl font-bold text-gray-900">12</p>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
					<h3 className="font-bold text-gray-900">Recent Activity</h3>
				</div>
				<div className="divide-y divide-gray-50">
					{logs.map((log) => (
						<div
							key={log.id}
							className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
						>
							<div className="flex items-center gap-4">
								<div
									className={`w-2 h-2 rounded-full ${
										log.type === "success"
											? "bg-emerald-500"
											: log.type === "warning"
												? "bg-amber-500"
												: "bg-blue-500"
									}`}
								/>
								<div>
									<p className="text-sm font-bold text-gray-900">{log.event}</p>
									<p className="text-xs text-gray-500">
										Triggered by: {log.user}
									</p>
								</div>
							</div>
							<span className="text-xs font-medium text-gray-400">
								{log.timestamp}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
