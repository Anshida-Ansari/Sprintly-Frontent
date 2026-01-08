import { useState } from "react";
import { useGetMembers } from "../hooks/useGetmembers";
import { Pagination } from "../../../shared/components/pagination";
import InviteMemberModal from '../components/invite.modal';
import { useInviteMember } from "../hooks/useInviteMember";
import { useBlockUser } from "../hooks/useBlockUser";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { Search, Filter, MoreVertical, Plus, User, Shield, Calendar, Ban, CheckCircle } from "lucide-react";

interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "block";
  createdAt: string;
}

export default function Members() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetMembers({ page, limit: 10, search: debouncedSearch });
  const { mutate: inviteMember, isPending: inviting } = useInviteMember();
  const { mutate: blockUser, isPending: blocking } = useBlockUser();

  const members = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleInvite = (payload: { name: string; email: string }) => {
    inviteMember(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Members</h1>
          <p className="text-slate-500 text-sm">Manage your team and their workspace permissions.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          <Plus size={18} />
          Invite Member
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Modern List Container */}
      <div className="space-y-3">
        {/* List Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-12 px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-5">Member</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Joined Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
            <User className="mx-auto text-slate-300 mb-4" size={40} />
            <p className="text-slate-500 font-medium">No team members found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member: Member) => (
              <div
                key={member._id}
                className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group"
              >
                {/* User Info */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold text-sm border border-slate-200 uppercase">
                    {member.name.substring(0, 2)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {member.name}
                    </span>
                    <span className="text-xs text-slate-500 truncate">{member.email}</span>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-2 hidden md:flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500">
                    <Shield size={14} />
                  </div>
                  <span className="text-sm text-slate-600 capitalize">{member.role}</span>
                </div>

                {/* Status */}
                <div className="col-span-2 hidden md:block">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${member.status === 'active'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {member.status === 'active' ? 'Active' : 'Blocked'}
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-2 hidden md:flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={14} className="text-slate-400" />
                  {new Date(member.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </div>

                <div className="col-span-1 text-right flex justify-end gap-2">
                  {member.status === "active" ? (
                    <button
                      onClick={() => blockUser({ userId: member._id, status: "block" })}
                      disabled={blocking}
                      className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                      title="Block User"
                    >
                      <Ban size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => blockUser({ userId: member._id, status: "active" })}
                      disabled={blocking}
                      className="p-2 hover:bg-emerald-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Unblock User"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <div className="bg-white px-2 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      <InviteMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleInvite}
        isLoading={inviting}
      />
    </div>
  );
}