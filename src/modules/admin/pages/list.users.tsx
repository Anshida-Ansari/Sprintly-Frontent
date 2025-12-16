import { useState } from "react";
import { useGetMembers } from "../hooks/useGetmembers"; 
import { Table } from "../../../shared/components/Table"
import { Pagination } from "../../../shared/components/pagination";
import InviteMemberBtn from '../components/invite.member.btn';
import InviteMemberModal from '../components/invite.modal';
import { useInviteMember } from "../hooks/useInviteMember";

interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "blocked";
  createdAt: string;
}

const columns = [
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
  {
    title: "Role",
    key: "role",
    render: (item: Member) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        item.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
      }`}>
        {item.role === "admin" ? "Admin" : "Developer"}
      </span>
    ),
  },
  {
    title: "Status",
    key: "status",
    render: (item: Member) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        item.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}>
        {item.status === "active" ? "Active" : "Blocked"}
      </span>
    ),
  },
  {
    title: "Joined",
    key: "createdAt",
    render: (item: Member) => new Date(item.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  },
];

export default function Members() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetMembers({ page, limit: 10, search });
  const { mutate: inviteMember, isPending: inviting } = useInviteMember();

  const members = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleInvite = (payload: { name: string; email: string }) => {
    inviteMember(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
        // Optional: refetch members
      },
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage your team and their access</p>
        </div>

        <InviteMemberBtn onClick={() => setIsModalOpen(true)} />
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 mt-4">Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No members found. Invite your team to get started!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table columns={columns} data={members} />
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Invite Modal */}
      <InviteMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleInvite}
        isLoading={inviting}
      />
    </div>
  );
}