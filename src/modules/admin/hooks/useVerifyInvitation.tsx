import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { inviteMemberService } from "../services/invite.member.sevice";

export function useVerifyInvitation() {
	return useMutation({
		mutationFn: (token: string) => inviteMemberService.verifyToken(token),

		onSuccess: (res) => {
			return res.data;
		},

		onError: (err: any) => {
			toast.error(err.response?.data?.message || "Invalid or expired link");
		},
	});
}
