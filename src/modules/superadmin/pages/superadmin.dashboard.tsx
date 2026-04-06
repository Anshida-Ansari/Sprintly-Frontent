import {
	Activity,
	Building2,
	ChevronRight,
	Download,
	Plus,
	Users,
	CheckCircle,
	Clock
} from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
	const { data, isLoading } = useDashboardStats();
	const navigate = useNavigate();

	const handleExport = () => {
		if (!data?.data?.recentCompanies) return;
		
		const companies = data.data.recentCompanies;
		const csvRows = [
			["Company Name", "Email", "Status", "Joined Date"]
		];
		
		companies.forEach((company: any) => {
			csvRows.push([
				company.companyName,
				company.email,
				company.status,
				new Date(company.createdAt).toLocaleDateString()
			]);
		});
		
		const csvContent = csvRows.map(row => row.join(",")).join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		
		link.setAttribute("href", url);
		link.setAttribute("download", `sprintly_companies_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-100px)] items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	const statsData = data?.data || {
		totalCompanies: 0,
		approvedCompanies: 0,
		pendingCompanies: 0,
		rejectedCompanies: 0,
		totalUsers: 0,
		recentCompanies: []
	};

	const stats = [
		{
			label: "Total Companies",
			value: statsData.totalCompanies,
			icon: Building2,
			color: "indigo",
		},
		{
			label: "Total Users",
			value: statsData.totalUsers,
			icon: Users,
			color: "blue",
		},
		{
			label: "Approved Companies",
			value: statsData.approvedCompanies,
			icon: CheckCircle,
			color: "emerald",
		},
		{
			label: "Pending Verifications",
			value: statsData.pendingCompanies,
			icon: Clock,
			color: "amber",
		},
	];

	return (
		<div className="space-y-8">
			{/* Dynamic Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">
						Dashboard
					</h1>
					<p className="text-gray-500">
						Welcome back! Here’s what’s happening with your platform today.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<button 
						onClick={handleExport}
						className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm font-semibold"
					>
						<Download size={18} /> Export CSV
					</button>
					<button 
						onClick={() => navigate('/superadmin/companies')}
						className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 text-sm font-semibold"
					>
						<Plus size={18} /> View All Companies
					</button>
				</div>
			</div>

			{/* Stats Bento Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => (
					<div
						key={index}
						className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
					>
						<div className="flex items-center justify-between">
							<div
								className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}
							>
								<stat.icon size={22} />
							</div>
						</div>
						<div className="mt-4">
							<p className="text-sm font-medium text-gray-500">{stat.label}</p>
							<h3 className="text-2xl font-bold text-gray-900 mt-1">
								{stat.value}
							</h3>
						</div>
					</div>
				))}
			</div>

			{/* Activity Table */}
			<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
				<div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white">
					<h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
						<Activity className="text-indigo-600" size={20}/>
						Recent Registrations
					</h3>
					<button 
						onClick={() => navigate('/superadmin/companies')}
						className="text-indigo-600 text-sm font-bold hover:underline inline-flex items-center gap-1"
					>
						View All <ChevronRight size={16} />
					</button>
				</div>
				<div className="overflow-x-auto">
					{statsData.recentCompanies.length > 0 ? (
						<table className="w-full text-left">
							<thead>
								<tr className="bg-gray-50/50">
									<th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
										Company
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
										Joined Date
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
										Action
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-50">
								{statsData.recentCompanies.map((company: any, index: number) => {
									const statusStyles: any = {
										approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
										rejected: "bg-rose-50 text-rose-700 border-rose-100",
										pending: "bg-amber-50 text-amber-700 border-amber-100",
									};

									return (
										<tr
											key={index}
											className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
											onClick={() => navigate(`/superadmin/companies/${company._id}`)}
										>
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
														{company.companyName.charAt(0)}
													</div>
													<div>
														<p className="text-sm font-bold text-gray-900 leading-none mb-1">
															{company.companyName}
														</p>
														<p className="text-xs text-gray-500">{company.email}</p>
													</div>
												</div>
											</td>
											<td className="px-6 py-4">
												<span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${statusStyles[company.status] || "bg-gray-50 text-gray-600"}`}>
													{company.status}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-gray-500 font-medium">
												{new Date(company.createdAt).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
											</td>
											<td className="px-6 py-4 text-right">
												<button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
													<ChevronRight size={18} />
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					) : (
						<div className="p-8 text-center text-gray-500">
							No recent companies found.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
