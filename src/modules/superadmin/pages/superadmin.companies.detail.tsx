import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { companyService } from "../services/company.services";

export default function SuperAdminCompanyDetail() {
  const { companyId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => companyService.getCompanyDetails(companyId!),
    enabled: !!companyId
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Failed to load company</p>;

  const company = data.data;
  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Company Details</h2>

      <div className="space-y-2">
        <p><strong>Name:</strong> {company.companyName}</p>
        <p><strong>Email:</strong> {company.email}</p>
        <p><strong>AdminId:</strong> {company.adminId}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded text-sm ${
              company.status === "approved"
                ? "bg-green-100 text-green-700"
                : company.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {company.status}
          </span>
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(company.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
