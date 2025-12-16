import { useMutation } from "@tanstack/react-query";
import {  useNavigate } from "react-router-dom";
import type { ResetPasswordRequest } from "../types/types";
import { authService } from "../services/auth.services";
import toast from "react-hot-toast";

export function useResetPassword(){
    const navigate = useNavigate()

    return useMutation({
        mutationFn:(data:ResetPasswordRequest)=>authService.ResetPassword(data),

        onSuccess:(res)=>{
            toast.success(res.message ||  "Password has been reset successfully")

            navigate('/login')
        },
        onError:(err:any)=>{
            toast.error(err.response?.data?.message || "Failed to reset the password")
        }
        
    })
}