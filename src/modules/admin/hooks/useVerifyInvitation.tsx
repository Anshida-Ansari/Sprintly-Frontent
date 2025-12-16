import { useMutation } from "@tanstack/react-query";
import { inviteMemberService } from "../services/invite.member.sevice";
import toast from "react-hot-toast";



export function useVerifyInvitation(){
    return useMutation({
        mutationFn:(token: string)=>inviteMemberService.verifyToken(token),

        onSuccess:(res)=>{
            return res.data
               },

      onError: (err: any) => {
      toast.error(err.response?.data?.message || "Invalid or expired link");
    },
    })
}