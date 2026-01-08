import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteMemberService } from "../services/invite.member.sevice";
import toast from "react-hot-toast";

export function useBlockUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: "active" | "block" }) =>
            inviteMemberService.blockUser(userId, status),
        onSuccess: (data) => {
            toast.success(data.message || "User status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update user status");
            console.log(error);
            
        },
    });
}
