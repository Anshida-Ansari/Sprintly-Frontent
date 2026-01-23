import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { inviteMemberService } from "../services/invite.member.sevice";
import type { InviteMemberPayload } from "../types/types";

export function useInviteMember() {
	return useMutation({
		mutationFn: (payload: InviteMemberPayload) =>
			inviteMemberService.inviteMember(payload),

		onSuccess: (res) => {
			toast.success(res.message || "The invitation is send");
		},
		onError: (err: any) => {
			toast.error(
				err.response?.data?.message || "Failed to send the invitation",
			);
		},
	});
}
