import { useQuery } from "@tanstack/react-query";
import {
	AlertCircle,
	ArrowLeft,
	Building2,
	Calendar,
	CheckCircle2,
	Mail,
	ShieldCheck,
	User,
	XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { companyService } from "../services/company.services";

export default function SuperAdminCompanyDetail() {
	const { companyId } = useParams();
	const navigate = useNavigate();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["company", companyId],
		queryFn: () => companyService.getCompanyDetails(companyId!),
		enabled: !!companyId,
	});

	if (isLoading)
		return (
			<div className="flex justify-center items-center h-64 text-indigo-600">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
			</div>
		);

	if (isError || !data)
		return (
			<div className="p-6 bg-red-50 border border-red-100 rounded-xl text-red-700 flex items-center gap-3">
				<AlertCircle className="w-5 h-5" />
				<p>Failed to load company details. Please try again later.</p>
			</div>
		);

	const company = data.data;

	// Define the allowed status keys
	type CompanyStatus = "approved" | "rejected" | "pending";

	const statusStyles: Record<CompanyStatus, string> = {
		approved: "bg-green-100 text-green-700 border-green-200",
		rejected: "bg-red-100 text-red-700 border-red-200",
		pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
	};
	return (
		<div className="max-w-5xl mx-auto space-y-6">
			{/* Navigation & Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition mb-2"
					>
						<ArrowLeft className="w-4 h-4" /> Back to Companies
					</button>
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
						<Building2 className="w-8 h-8 text-indigo-600" />
						{company.companyName}
					</h1>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3">
					<button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition">
						<XCircle className="w-4 h-4" /> Reject
					</button>
					<button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium shadow-sm transition">
						<CheckCircle2 className="w-4 h-4" /> Approve Company
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Main Details Card */}
				<div className="md:col-span-2 space-y-6">
					<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
						<div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
							<h2 className="font-semibold text-gray-900">
								General Information
							</h2>
						</div>
						<div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div className="space-y-1">
								<p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
									Company Email
								</p>
								<div className="flex items-center gap-2 text-gray-700">
									<Mail className="w-4 h-4 text-gray-400" />
									<span>{company.email}</span>
								</div>
							</div>
							<div className="space-y-1">
								<p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
									Status
								</p>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
										statusStyles[company.status as CompanyStatus] ||
										statusStyles.pending
									}`}
								>
									{company.status}
								</span>
							</div>
							<div className="space-y-1">
								<p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
									Registration Date
								</p>
								<div className="flex items-center gap-2 text-gray-700">
									<Calendar className="w-4 h-4 text-gray-400" />
									<span>
										{new Date(company.createdAt).toLocaleDateString(undefined, {
											dateStyle: "long",
										})}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Sidebar / Admin Info */}
				<div className="space-y-6">
					<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
						<h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<ShieldCheck className="w-5 h-5 text-indigo-600" />
							Administrative
						</h2>
						<div className="space-y-4">
							<div>
								<p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
									Owner Admin ID
								</p>
								<div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 font-mono text-xs text-slate-600">
									<User className="w-3 h-3" />
									{company.adminId}
								</div>
							</div>
							<div className="pt-4 border-t border-gray-100">
								<p className="text-sm text-gray-500">
									This company was created via the{" "}
									{company.source || "Standard Web"} portal.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
