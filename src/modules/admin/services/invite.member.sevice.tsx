import api from "../../../lib/axios.user";
import type { InviteMemberPayload, InviteMemberResponse, SetPasswordPayload, SetPasswordResponse, VerifyInvitationResponse } from "../types/types";

export const inviteMemberService = {
    async inviteMember(payload: InviteMemberPayload): Promise<InviteMemberResponse> {
        const res = await api.post('admin/members/invite', payload)
        return res.data
    },
    async verifyToken(token: string):Promise<VerifyInvitationResponse>{
        const res = await api.post('admin/verify-members',{token})
        return res.data
    },
    async setpassword(payload:SetPasswordPayload):Promise<SetPasswordResponse>{
        const res = await api.post('auth/set-password',payload)
        return res.data
    }
}