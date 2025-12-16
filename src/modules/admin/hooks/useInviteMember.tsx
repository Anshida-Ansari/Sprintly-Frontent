import {  useMutation } from "@tanstack/react-query";
import { UserAuth } from "../../auth/store/store";
import type { InviteMemberPayload } from "../types/types";
import { inviteMemberService } from "../services/invite.member.sevice";
import toast from "react-hot-toast";

export function useInviteMember(){
    // const user = UserAuth((s)=>s.user)

    return useMutation({
        mutationFn:(payload:InviteMemberPayload)=>inviteMemberService.inviteMember(payload),

        onSuccess:(res)=>{
            toast.success(res.message || "The invitation is send")
        },
        onError:(err:any)=>{
            toast.error(err.response?.data?.message || "Failed to send the invitation")
        }
    })

   
}