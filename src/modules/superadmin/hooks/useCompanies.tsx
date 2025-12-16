import { useQuery } from "@tanstack/react-query";
import { type CompanyListResponse, type CompanyListQuery } from "../types/types";
import { companyService } from "../services/company.services";

export function useCompanies(page: number, limit: number, search?: string) {
  const query: CompanyListQuery = { page, limit, search };

  return useQuery<CompanyListResponse>({
    queryKey: ["companies", page, limit, search],
    queryFn: () => companyService.ListCompanies(query),
    placeholderData: (prev) => prev,
  });
}
