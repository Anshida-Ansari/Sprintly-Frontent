import {
	ArrowDown,
	ArrowUp,
	Building2,
	ChevronRight,
	DollarSign,
	MoreVertical,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";

export default function SuperAdminDashboard() {
	const [timeRange, setTimeRange] = useState("month");

	const stats = [
		{
			label: "Total Companies",
			value: "45",
			subtext: "of Companies",
			change: "+12%",
			trending: "up",
			icon: Building2,
			color: "blue",
		},
		{
			label: "Active Users",
			value: "320",
			subtext: "Users",
			change: "+8%",
			trending: "up",
			icon: Users,
			color: "green",
		},
		{
			label: "Active Subscriptions",
			value: "80",
			subtext: "Monthly Revenue: $12,500",
			change: "+15%",
			trending: "up",
			icon: TrendingUp,
			color: "purple",
		},
		{
			label: "Total Users",
			value: "320",
			subtext: "Users",
			change: "-2%",
			trending: "down",
			icon: Users,
			color: "orange",
		},
	];

	const recentCompanies = [
		{
			name: "Company Acme Corp",
			user: "John Doe",
			plan: "Premium Plan",
			joined: "2023-09-01 9:00 AM",
			status: "registered",
		},
		{
			name: "TechStart Inc",
			user: "User Alex Smith",
			plan: "Standard Plan",
			joined: "2023-09-02 2:30 PM",
			status: "added",
		},
		{
			name: "Global Solutions",
			user: "Sarah Johnson",
			plan: "Basic Plan",
			joined: "2023-09-03 11:15 AM",
			status: "registered",
		},
		{
			name: "Innovation Labs",
			user: "Mike Wilson",
			plan: "Premium Plan",
			joined: "2023-09-04 4:45 PM",
			status: "added",
		},
	];

	const subscriptionData = [
		{ month: "Jan", value: 65 },
		{ month: "Feb", value: 70 },
		{ month: "Mar", value: 72 },
		{ month: "Apr", value: 75 },
		{ month: "May", value: 78 },
		{ month: "Jun", value: 80 },
	];

	const planDistribution = [
		{ name: "Premium Plan", count: 45, percentage: 56 },
		{ name: "Standard Plan", count: 25, percentage: 31 },
		{ name: "Basic Plan", count: 10, percentage: 13 },
	];

	const maxValue = Math.max(...subscriptionData.map((d) => d.value));

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 px-8 py-6 mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Platform Overview
						</h1>
						<p className="text-gray-500 mt-1">
							Monitor your platform's performance and key metrics
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
							Export
						</button>
						<button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
							Upload
						</button>
					</div>
				</div>
			</div>

			<div className="px-8 pb-8">
				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{stats.map((stat, index) => {
						const Icon = stat.icon;
						const colors = {
							blue: "bg-blue-50 text-blue-600",
							green: "bg-green-50 text-green-600",
							purple: "bg-purple-50 text-purple-600",
							orange: "bg-orange-50 text-orange-600",
						};
						return (
							<div
								key={index}
								className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
							>
								<div className="flex items-start justify-between mb-4">
									{/* <div className={`p-3 rounded-lg ${colors[stat.color]}`}>
                    <Icon size={24} />
                  </div> */}
									<div
										className={`flex items-center gap-1 text-sm font-semibold ${stat.trending === "up" ? "text-green-600" : "text-red-600"}`}
									>
										{stat.trending === "up" ? (
											<ArrowUp size={16} />
										) : (
											<ArrowDown size={16} />
										)}
										{stat.change}
									</div>
								</div>
								<h3 className="text-gray-600 text-sm font-medium mb-1">
									{stat.label}
								</h3>
								<p className="text-3xl font-bold text-gray-900 mb-1">
									{stat.value}
								</p>
								<p className="text-xs text-gray-500">{stat.subtext}</p>
							</div>
						);
					})}
				</div>

				{/* Secondary Stats */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Subscription Growth */}
					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
						<div className="flex items-center justify-between mb-2">
							<h2 className="text-lg font-semibold text-gray-900">
								Subscription Growth Rate
							</h2>
							<TrendingUp className="text-green-600" size={20} />
						</div>
						<div className="flex items-baseline gap-2 mb-1">
							<span className="text-3xl font-bold text-green-600">+15%</span>
							<span className="text-sm text-gray-500">Last 6 Months</span>
						</div>
					</div>

					{/* Companies Joined */}
					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
						<div className="flex items-center justify-between mb-2">
							<h2 className="text-lg font-semibold text-gray-900">
								Companies Joined Per Month
							</h2>
							<Building2 className="text-blue-600" size={20} />
						</div>
						<div className="flex items-baseline gap-2 mb-1">
							<span className="text-3xl font-bold text-blue-600">10</span>
							<span className="text-sm text-gray-500">
								Last 6 Months • +10%
							</span>
						</div>
					</div>
				</div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					{/* Monthly Subscription Trends */}
					<div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-semibold text-gray-900">
								Monthly Subscription Trends
							</h2>
							<button className="text-gray-400 hover:text-gray-600">
								<MoreVertical size={20} />
							</button>
						</div>
						<div className="space-y-4">
							{subscriptionData.map((item, index) => (
								<div key={index} className="flex items-center gap-4">
									<span className="text-sm font-medium text-gray-600 w-8">
										{item.month}
									</span>
									<div className="flex-1 bg-gray-100 rounded-full h-10 relative overflow-hidden">
										<div
											className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-4"
											style={{ width: `${(item.value / maxValue) * 100}%` }}
										>
											<span className="text-white text-sm font-semibold">
												{item.value}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Subscription Types Distribution */}
					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-6">
							Subscription Types Distribution
						</h2>
						<div className="space-y-5">
							{planDistribution.map((plan, index) => (
								<div key={index}>
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-medium text-gray-700">
											{plan.name}
										</span>
										<span className="text-sm font-bold text-gray-900">
											{plan.count} ({plan.percentage}%)
										</span>
									</div>
									<div className="w-full bg-gray-100 rounded-full h-2.5">
										<div
											className={`h-2.5 rounded-full ${
												index === 0
													? "bg-purple-500"
													: index === 1
														? "bg-blue-500"
														: "bg-gray-400"
											}`}
											style={{ width: `${plan.percentage}%` }}
										></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Revenue Overview */}
				<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
					<h2 className="text-lg font-semibold text-gray-900 mb-6">
						Revenue Overview
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<div className="bg-blue-50 rounded-lg p-4">
							<p className="text-sm text-blue-600 font-medium mb-1">MRR</p>
							<p className="text-2xl font-bold text-blue-700">$12,500</p>
						</div>
						<div className="bg-green-50 rounded-lg p-4">
							<p className="text-sm text-green-600 font-medium mb-1">ARR</p>
							<p className="text-2xl font-bold text-green-700">$150,000</p>
						</div>
						<div className="bg-purple-50 rounded-lg p-4">
							<p className="text-sm text-purple-600 font-medium mb-1">ARPU</p>
							<p className="text-2xl font-bold text-purple-700">$39.06</p>
						</div>
						<div className="bg-orange-50 rounded-lg p-4">
							<p className="text-sm text-orange-600 font-medium mb-1">
								Churn Rate
							</p>
							<p className="text-2xl font-bold text-orange-700">2.3%</p>
						</div>
					</div>
				</div>

				{/* Recent Activity Table */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200">
					<div className="p-6 border-b border-gray-200">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">
								Recent Activity
							</h2>
							<button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
								View All <ChevronRight size={16} />
							</button>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Company/User
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Subscription Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date & Time
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{recentCompanies.map((company, index) => (
									<tr
										key={index}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-6 py-4">
											<div className="flex items-center">
												<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
													{company.name.charAt(0)}
												</div>
												<div className="ml-3">
													<p className="font-medium text-gray-900 text-sm">
														{company.name}
													</p>
													<p className="text-xs text-gray-500">
														{company.user}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium ${
													company.plan === "Premium Plan"
														? "bg-purple-100 text-purple-700"
														: company.plan === "Standard Plan"
															? "bg-blue-100 text-blue-700"
															: "bg-gray-100 text-gray-700"
												}`}
											>
												{company.plan}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
											{company.joined}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium ${
													company.status === "registered"
														? "bg-green-100 text-green-700"
														: "bg-blue-100 text-blue-700"
												}`}
											>
												{company.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
