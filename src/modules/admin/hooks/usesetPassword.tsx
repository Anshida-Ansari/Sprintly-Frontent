import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { inviteMemberService } from "../services/invite.member.sevice";
import type { SetPasswordPayload } from "../types/types";

export function useSetPassword() {
	const navigate = useNavigate();
	return useMutation({
		mutationFn: (payload: SetPasswordPayload) =>
			inviteMemberService.setpassword(payload),

		onSuccess: (res) => {
			toast.success(res.message || "Account created successfully");
			navigate("/login");
		},

		onError: (err: any) => {
			toast.error(err.response?.data?.message || "Failed to set Password");
		},
	});
}
