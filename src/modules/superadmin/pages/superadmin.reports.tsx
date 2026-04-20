import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, CreditCard, FileText, Zap } from "lucide-react";
import { useState } from "react";
import { PaginatedTable } from "../../../shared/components/PaginatedTable";
import { companyService } from "../services/company.services";

type ReportType = "subscriptions" | "payments" | "expiring" | "trials";

export default function SuperAdminReports() {
	const [activeTab, setActiveTab] = useState<ReportType>("subscriptions");
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const reports = {
		subscriptions: {
			title: "Subscription Report",
			icon: FileText,
			queryKey: ["report-subscriptions", page, limit],
			queryFn: () => companyService.getSubscriptionReport(page, limit),
			columns: [
				{
					header: "Company",
					key: "companyName",
					render: (item: any) => (
						<span className="font-bold text-gray-900">{item.companyName}</span>
					),
				},
				{
					header: "Plan",
					key: "plan",
					render: (item: any) => (
						<span
							className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${item.plan === "PRO" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
						>
							{item.plan}
						</span>
					),
				},
				{
					header: "End Date",
					key: "endDate",
					render: (item: any) => (
						<div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
							<Calendar size={14} className="text-gray-400" />
							{item.endDate !== "N/A"
								? new Date(item.endDate).toLocaleDateString()
								: "N/A"}
						</div>
					),
				},
				{
					header: "Status",
					key: "status",
					render: (item: any) => {
						const statusColors = {
							Active: "bg-emerald-50 text-emerald-700",
							Expired: "bg-rose-50 text-rose-700",
							"Expiring Soon":
								"bg-amber-50 text-amber-700 font-bold animate-pulse",
						};
						return (
							<span
								className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[item.status as keyof typeof statusColors]}`}
							>
								{item.status}
							</span>
						);
					},
				},
				{
					header: "Renewal",
					key: "autoRenew",
					render: (item: any) => (
						<span
							className={`text-xs font-bold ${item.autoRenew ? "text-emerald-600" : "text-gray-400"}`}
						>
							{item.autoRenew ? "Auto-Renew ON" : "Manual"}
						</span>
					),
				},
			],
		},
		payments: {
			title: "Payment History",
			icon: CreditCard,
			queryKey: ["report-payments", page, limit],
			queryFn: () => companyService.getPaymentReport(page, limit),
			columns: [
				{
					header: "Transaction ID",
					key: "paymentId",
					render: (item: any) => (
						<span className="font-mono text-xs text-indigo-600 font-bold">
							{item.paymentId}
						</span>
					),
				},
				{
					header: "Company",
					key: "companyName",
					render: (item: any) => (
						<span className="font-bold text-gray-900">{item.companyName}</span>
					),
				},
				{
					header: "Amount",
					key: "amount",
					render: (item: any) => (
						<span className="font-black text-gray-900">
							₹{item.amount.toLocaleString()}
						</span>
					),
				},
				{
					header: "Status",
					key: "status",
					render: (item: any) => (
						<span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-black uppercase">
							{item.status}
						</span>
					),
				},
				{
					header: "Date",
					key: "date",
					render: (item: any) => (
						<span className="text-sm font-medium text-gray-500">
							{new Date(item.date).toLocaleDateString()}
						</span>
					),
				},
			],
		},
		expiring: {
			title: "Expiring Soon",
			icon: Clock,
			queryKey: ["report-expiring", page, limit],
			queryFn: () => companyService.getExpiringSoonReport(page, limit),
			columns: [
				{
					header: "Company",
					key: "companyName",
					render: (item: any) => (
						<span className="font-bold text-gray-900">{item.companyName}</span>
					),
				},
				{
					header: "Expiry Date",
					key: "endDate",
					render: (item: any) => (
						<span className="text-sm font-bold text-rose-600">
							{new Date(item.endDate).toLocaleDateString()}
						</span>
					),
				},
				{ header: "Plan", key: "plan" },
				{
					header: "Auto-Renew",
					key: "autoRenew",
					render: (item: any) => <span>{item.autoRenew ? "Yes" : "No"}</span>,
				},
			],
		},
		trials: {
			title: "Trial Users (Free)",
			icon: Zap,
			queryKey: ["report-trials", page, limit],
			queryFn: () => companyService.getTrialReport(page, limit),
			columns: [
				{
					header: "Company",
					key: "companyName",
					render: (item: any) => (
						<span className="font-bold text-gray-900">{item.companyName}</span>
					),
				},
				{
					header: "Projects",
					key: "projectCount",
					render: (item: any) => (
						<div className="flex items-center gap-2">
							<span className="font-bold text-gray-900">
								{item.projectCount} / {item.projectLimit}
							</span>
							<div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-indigo-500"
									style={{
										width: `${(item.projectCount / item.projectLimit) * 100}%`,
									}}
								/>
							</div>
						</div>
					),
				},
				{
					header: "Joined Date",
					key: "createdAt",
					render: (item: any) => (
						<span className="text-sm text-gray-500">
							{new Date(item.createdAt).toLocaleDateString()}
						</span>
					),
				},
			],
		},
	};

	const currentReport = reports[activeTab];

	const { data, isLoading } = useQuery({
		queryKey: currentReport.queryKey,
		queryFn: currentReport.queryFn,
	});

	const handleTabChange = (tab: ReportType) => {
		setActiveTab(tab);
		setPage(1);
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Platform Reports
				</h1>
				<p className="text-gray-500 font-medium">
					Exportable data and detailed logs for all platform activities.
				</p>
			</div>

			{/* Tabs Navigation */}
			<div className="flex flex-wrap items-center gap-2 bg-gray-50 p-1.5 rounded-2xl w-fit border border-gray-100">
				{(Object.keys(reports) as ReportType[]).map((tab) => {
					const Icon = reports[tab].icon;
					return (
						<button
							key={tab}
							onClick={() => handleTabChange(tab)}
							className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
								activeTab === tab
									? "bg-white text-indigo-600 shadow-sm"
									: "text-gray-500 hover:text-gray-900 hover:bg-white/50"
							}`}
						>
							<Icon size={18} />
							{reports[tab].title.split(" ")[0]}
						</button>
					);
				})}
			</div>

			{/* Main Report Table */}
			<PaginatedTable
				title={currentReport.title}
				columns={currentReport.columns}
				data={data?.data || []}
				total={data?.total || 0}
				page={page}
				limit={limit}
				onPageChange={setPage}
				onLimitChange={setLimit}
				onSearch={(term) => console.log("Searching for:", term)}
				isLoading={isLoading}
			/>
		</div>
	);
}
