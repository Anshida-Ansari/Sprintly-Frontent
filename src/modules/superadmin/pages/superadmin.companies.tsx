import {  useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useCompanies } from "../hooks/useCompanies";
import { Table } from "../../../shared/components/Table"
import { Pagination } from "../../../shared/components/pagination";
import { type Company } from "../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "../services/company.services";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// superadmin.companies.tsx




export default function SuperAdminCompanyPage() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      companyService.UpdateStatus(id, "approved"),
    onSuccess: () => {
      toast.success("Company approved successfully")
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
    onError:()=>{
      toast.error("Failed to approve company")
    }
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      companyService.UpdateStatus(id, "rejected"),
    onSuccess: () => {
      toast.success("Company reject successfully")
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
    onError:()=>{
      toast.error("Failed to reject company")
    }
  })


  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isPending } = useCompanies(page, limit, debouncedSearch);

  const columns = [
    { title: "Company Name", key: "companyName" },
    { title: "Email", key: "email" },
    { title: "Status", key: "status" },
    { title: "Created At", key: "createdAt" },
  ];

    const formattedData = data?.data.map((company) => ({
    ...company,
    createdAt: new Date(company.createdAt).toLocaleDateString(),
  }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search companies..."
        className="border px-3 py-2 mb-4 w-full rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={formattedData || []}
        actions={(company: Company) => (
          <div className="flex gap-2">
            <button
              onClick={() => approveMutation.mutate(company._id)}
              className="px-3 py-1 bg-green-500 text-white rounded">
              Approve
            </button>
            <button
              onClick={() => rejectMutation.mutate(company._id)}
              className="px-3 py-1 bg-red-500 text-white rounded">
              Reject
            </button>
            <button
              onClick={() => navigate(`/superadmin/companies/${company._id}`)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded">
              Detail
            </button>
          </div>
        )}
      />

      {/* Pagination */}
      {data && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
