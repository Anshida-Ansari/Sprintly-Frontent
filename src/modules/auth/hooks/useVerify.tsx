import { useNavigate } from "react-router-dom";
import { UserAuth } from "../store/store";
import { useMutation } from "@tanstack/react-query";
import type { VerifyOtpRequest } from "../types/types";
import { authService } from "../services/auth.services";
import toast from "react-hot-toast";

export function useVerifyOtp(){
    const navigate = useNavigate()
    const login = UserAuth((s)=>s.login)

    return useMutation({
        mutationFn:(data:VerifyOtpRequest)=>authService.verifyOtp(data),

        onSuccess:(res)=>{
            toast.success("OTP verified")

            login(res.user,res.accessToken)

            navigate("/dashboard")


        },

        onError:(err:any)=>{
            toast.error(err.response?.data?.message || "Invalid OTP")
        }
    })
}