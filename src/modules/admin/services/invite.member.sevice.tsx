import { API_ENDPOINTS } from "../../../constants/api-endpoints.constants";
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
		const res = await api.post(API_ENDPOINTS.ADMIN.MEMBER.INVITE, payload);
		return res.data;
	},
	async verifyToken(token: string): Promise<VerifyInvitationResponse> {
		const res = await api.post(API_ENDPOINTS.ADMIN.MEMBER.VERIFY_INVITATION, {
			token,
		});
		return res.data;
	},
	async setpassword(payload: SetPasswordPayload): Promise<SetPasswordResponse> {
		const res = await api.post(API_ENDPOINTS.AUTH.SET_PASSWORD, payload);
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

		const res = await api.get(
			`${API_ENDPOINTS.ADMIN.MEMBER.LIST}?${params.toString()}`,
		);

		if (res.data?.data) {
			res.data.data = res.data.data.map(mapMember);
		}

		return res.data;
	},
	async blockUser(userId: string, status: "active" | "block") {
		const res = await api.patch(API_ENDPOINTS.ADMIN.MEMBER.BLOCK(userId), {
			status,
		});
		return res.data;
	},
};
