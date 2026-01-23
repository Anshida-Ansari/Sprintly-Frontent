import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	Building2,
	CheckCircle2,
	Eye,
	Filter,
	Search,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../shared/components/pagination";
import { Table } from "../../../shared/components/Table";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useCompanies } from "../hooks/useCompanies";
import { companyService } from "../services/company.services";
import type { Company } from "../types/types";

export default function SuperAdminCompanyPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const approveMutation = useMutation({
		mutationFn: (id: string) => companyService.UpdateStatus(id, "approved"),
		onSuccess: () => {
			toast.success("Company approved successfully");
			queryClient.invalidateQueries({ queryKey: ["companies"] });
		},
		onError: () => toast.error("Failed to approve company"),
	});

	const rejectMutation = useMutation({
		mutationFn: (id: string) => companyService.UpdateStatus(id, "rejected"),
		onSuccess: () => {
			toast.success("Company rejected successfully");
			queryClient.invalidateQueries({ queryKey: ["companies"] });
		},
		onError: () => toast.error("Failed to reject company"),
	});

	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);

	const { data, isPending } = useCompanies(page, limit, debouncedSearch);

	// FIXED COLUMNS TO MATCH YOUR TABLE TYPE
	const columns = [
		{
			title: "Company",
			key: "companyName",
			render: (company: Company) => (
				<div className="flex items-center gap-3">
					<div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
						{company.companyName.charAt(0)}
					</div>
					<div>
						<p className="font-bold text-gray-900 leading-none">
							{company.companyName}
						</p>
						<p className="text-xs text-gray-500 mt-1">{company.email}</p>
					</div>
				</div>
			),
		},
		{
			title: "Status",
			key: "status",
			render: (company: Company) => {
				const status = company.status;
				const styles = {
					approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
					rejected: "bg-rose-50 text-rose-700 border-rose-100",
					pending: "bg-amber-50 text-amber-700 border-amber-100",
				};
				return (
					<span
						className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${styles[status as keyof typeof styles] || "bg-gray-50 text-gray-600"}`}
					>
						{status}
					</span>
				);
			},
		},
		{
			title: "Created At",
			key: "createdAt",
			render: (company: Company) => (
				<span className="text-sm text-gray-600 font-medium">
					{new Date(company.createdAt).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</span>
			),
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">
						Companies
					</h1>
					<p className="text-gray-500 mt-1 font-medium">
						Manage and verify company registrations.
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
					<Building2 size={16} className="text-indigo-500" />
					Total Companies:{" "}
					<span className="text-indigo-600">{data?.total || 0}</span>
				</div>
			</div>

			{/* Control Bar */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<Search
						className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
						size={18}
					/>
					<input
						type="text"
						placeholder="Search by company name or email..."
						className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-sm text-sm"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-bold shadow-sm text-sm">
					<Filter size={18} /> Filters
				</button>
			</div>

			{/* Table Container */}
			<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
				<Table
					columns={columns}
					data={data?.data || []} // Use original data, render handles formatting
					actions={(company: Company) => (
						<div className="flex items-center gap-1">
							{company.status !== "approved" && (
								<button
									onClick={() => approveMutation.mutate(company._id)}
									className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors group"
									title="Approve"
								>
									<CheckCircle2 size={18} />
								</button>
							)}
							{company.status !== "rejected" && (
								<button
									onClick={() => rejectMutation.mutate(company._id)}
									className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
									title="Reject"
								>
									<XCircle size={18} />
								</button>
							)}
							<div className="h-4 w-px bg-gray-200 mx-2" />
							<button
								onClick={() => navigate(`/superadmin/companies/${company._id}`)}
								className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-bold text-xs"
							>
								<Eye size={14} /> DETAILS
							</button>
						</div>
					)}
				/>
			</div>

			{/* Pagination Footer */}
			{data && (
				<div className="flex justify-center mt-6">
					<Pagination
						currentPage={page}
						totalPages={data.totalPages}
						onPageChange={setPage}
					/>
				</div>
			)}
		</div>
	);
}
