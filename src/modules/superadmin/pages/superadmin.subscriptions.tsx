import { formatDistanceToNow } from "date-fns";
import { CreditCard, IndianRupee, PieChart, Users, Zap } from "lucide-react";
import { useSubscriptionAnalytics } from "../hooks/useSubscriptionAnalytics";

export default function SuperAdminSubscriptions() {
	const { data, isLoading } = useSubscriptionAnalytics();

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-100px)] items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	const analytics = data?.data || {
		totalCompanies: 0,
		proCompanies: 0,
		freeCompanies: 0,
		mrr: 0,
		companies: [],
	};

	const stats = [
		{
			label: "Total Subscriptions",
			value: analytics.totalCompanies,
			icon: Users,
			color: "blue",
		},
		{
			label: "Pro Plans",
			value: analytics.proCompanies,
			icon: Zap,
			color: "indigo",
		},
		{
			label: "Free Tier",
			value: analytics.freeCompanies,
			icon: PieChart,
			color: "gray",
		},
		{
			label: "Monthly Recurring Revenue",
			value: `₹${analytics.mrr}`,
			icon: IndianRupee,
			color: "emerald",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">
						Subscriptions
					</h1>
					<p className="text-gray-500">
						Monitor subscription analytics, MRR, and plan distributions.
					</p>
				</div>
			</div>

			{/* Stats Grid */}
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

			{/* Companies Subscriptions Table */}
			<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
				<div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white">
					<h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
						<CreditCard className="text-indigo-600" size={20} />
						Company Subscription Details
					</h3>
				</div>
				<div className="overflow-x-auto">
					{analytics.companies.length > 0 ? (
						<table className="w-full text-left">
							<thead>
								<tr className="bg-gray-50/50">
									<th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
										Company
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
										Plan Type
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
										Renewal / Expiry Status
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
										Stripe ID
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-50">
								{analytics.companies.map((company: any) => (
									<tr
										key={company.id}
										className="hover:bg-gray-50/50 transition-colors group"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
													{company.companyName.charAt(0)}
												</div>
												<p className="text-sm font-bold text-gray-900">
													{company.companyName}
												</p>
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
													company.currentPlan === "PRO"
														? "bg-indigo-100 text-indigo-700"
														: "bg-gray-100 text-gray-600"
												}`}
											>
												{company.currentPlan}
											</span>
										</td>
										<td className="px-6 py-4">
											{company.subscriptionEndDate ? (
												<div className="flex items-center gap-2">
													<div
														className={`h-2 w-2 rounded-full ${
															new Date(company.subscriptionEndDate) > new Date()
																? "bg-emerald-500"
																: "bg-red-500"
														}`}
													></div>
													<div className="flex flex-col">
														<span className="text-sm font-semibold text-gray-900">
															{new Date(
																company.subscriptionEndDate,
															).toLocaleDateString()}
														</span>
														<span className="text-xs text-gray-500 mt-0.5">
															{formatDistanceToNow(
																new Date(company.subscriptionEndDate),
																{ addSuffix: true },
															)}
														</span>
													</div>
												</div>
											) : (
												<span className="text-sm text-gray-400 italic">
													No Active Renewal
												</span>
											)}
										</td>
										<td className="px-6 py-4 text-sm font-mono text-gray-500">
											{company.stripeCustomerId ? (
												<span
													className="truncate w-32 inline-block"
													title={company.stripeCustomerId}
												>
													{company.stripeCustomerId}
												</span>
											) : (
												<span className="text-gray-300">-</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="p-8 text-center text-gray-500">
							No subscription data found.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
