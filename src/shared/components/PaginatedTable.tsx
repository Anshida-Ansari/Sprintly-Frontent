import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

interface Column<T> {
	header: string;
	key: keyof T | string;
	render?: (item: T) => React.ReactNode;
}

interface PaginatedTableProps<T> {
	title: string;
	columns: Column<T>[];
	data: T[];
	total: number;
	page: number;
	limit: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
	onSearch?: (term: string) => void;
	isLoading?: boolean;
}

export function PaginatedTable<T>({
	title,
	columns,
	data,
	total,
	page,
	limit,
	onPageChange,
	onLimitChange,
	onSearch,
	isLoading,
}: PaginatedTableProps<T>) {
	const [searchTerm, setSearchTerm] = useState("");
	const totalPages = Math.ceil(total / limit);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch?.(searchTerm);
	};

	return (
		<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
			<div className="px-6 py-5 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
				<h3 className="font-bold text-gray-900 text-lg whitespace-nowrap">
					{title}
				</h3>

				<div className="flex items-center gap-3">
					{onSearch && (
						<form onSubmit={handleSearch} className="relative">
							<input
								type="text"
								placeholder="Search..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full md:w-64 transition-all"
							/>
							<Search
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								size={18}
							/>
						</form>
					)}

					<select
						value={limit}
						onChange={(e) => onLimitChange(Number(e.target.value))}
						className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
					>
						{[10, 20, 50].map((l) => (
							<option key={l} value={l}>
								{l} per page
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left">
					<thead>
						<tr className="bg-gray-50/50">
							{columns.map((col) => (
								<th
									key={col.header}
									className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider"
								>
									{col.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-50">
						{isLoading ? (
							<tr>
								<td colSpan={columns.length} className="px-6 py-10 text-center">
									<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
								</td>
							</tr>
						) : data.length > 0 ? (
							data.map((item, rowIdx) => (
								<tr
									key={(item as any)._id || (item as any).id || rowIdx}
									className="hover:bg-gray-50/50 transition-colors group"
								>
									{columns.map((col) => (
										<td key={col.key as string} className="px-6 py-4">
											{col.render ? col.render(item) : (item as any)[col.key]}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={columns.length}
									className="px-6 py-10 text-center text-gray-400 italic font-medium"
								>
									No records found matching your criteria.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination Footer */}
			<div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
				<div className="text-sm text-gray-500 font-medium">
					Showing{" "}
					<span className="text-gray-900">{(page - 1) * limit + 1}</span> to{" "}
					<span className="text-gray-900">{Math.min(page * limit, total)}</span>{" "}
					of <span className="text-gray-900">{total}</span> results
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => onPageChange(page - 1)}
						disabled={page === 1}
						className="p-2 bg-white border border-gray-100 rounded-lg text-gray-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
					>
						<ChevronLeft size={20} />
					</button>

					<div className="flex items-center bg-white border border-gray-100 rounded-lg shadow-sm">
						{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
							let pageNum = page;
							if (totalPages > 5) {
								if (page <= 3) pageNum = i + 1;
								else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
								else pageNum = page - 2 + i;
							} else {
								pageNum = i + 1;
							}

							return (
								<button
									key={pageNum}
									onClick={() => onPageChange(pageNum)}
									className={`px-4 py-2 text-sm font-bold transition-all ${
										page === pageNum
											? "bg-indigo-600 text-white"
											: "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
									}`}
								>
									{pageNum}
								</button>
							);
						})}
					</div>

					<button
						onClick={() => onPageChange(page + 1)}
						disabled={page === totalPages}
						className="p-2 bg-white border border-gray-100 rounded-lg text-gray-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
					>
						<ChevronRight size={20} />
					</button>
				</div>
			</div>
		</div>
	);
}
