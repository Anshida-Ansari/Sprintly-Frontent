import api from "../../../lib/axios.user";
import type {
	GetMembersResponse,
	IMember,
	InviteMemberPayload,
	InviteMemberResponse,
	SetPasswordPayload,
	SetPasswordResponse,
	VerifyInvitationResponse,
} from "../types/types";

const mapMember = (m: Partial<IMember>): IMember => ({
	id: m._id || m.id || "",
	_id: m._id || m.id || "",
	name: m.name || "",
	email: m.email || "",
	role: m.role || "developer",
	status: m.status || "pending",
	companyId: m.companyId || "",
	createdAt: m.createdAt || new Date().toISOString(),
	updatedAt: m.updatedAt || new Date().toISOString(),
});

export const inviteMemberService = {
	async inviteMember(
		payload: InviteMemberPayload,
	): Promise<InviteMemberResponse> {
		const res = await api.post("admin/invite-member", payload);
		return res.data;
	},
	async verifyToken(token: string): Promise<VerifyInvitationResponse> {
		const res = await api.post("admin/verify-invitation", { token });
		return res.data;
	},
	async setpassword(payload: SetPasswordPayload): Promise<SetPasswordResponse> {
		const res = await api.post("auth/set-password", payload);
		return res.data;
	},
	async getMembers({
		page,
		limit,
		search,
	}: {
		page: number;
		limit: number;
		search?: string;
	}): Promise<GetMembersResponse> {
		const params = new URLSearchParams();
		params.append("page", page.toString());
		params.append("limit", limit.toString());
		if (search) params.append("search", search);

		const res = await api.get(`/admin/members?${params.toString()}`);

		if (res.data && res.data.data) {
			res.data.data = res.data.data.map(mapMember);
		}

		return res.data;
	},
	async blockUser(userId: string, status: "active" | "block") {
		const res = await api.patch(`admin/block-user/${userId}`, { status });
		return res.data;
	},
};
