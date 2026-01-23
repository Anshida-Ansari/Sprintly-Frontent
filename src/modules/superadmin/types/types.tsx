export interface Company {
	_id: string;
	companyName: string;
	email: string;
	status: "pending" | "approved" | "rejected";
	createdAt: string;
}

export interface CompanyListResponse {
	data: Company[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CompanyListQuery {
	page: number;
	limit: number;
	search?: string;
}
