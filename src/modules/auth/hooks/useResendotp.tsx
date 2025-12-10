import { useMutation } from "@tanstack/react-query";
import type { ResendOtpRequest } from "../types/types";
import { authService } from "../services/auth.services";
import toast from "react-hot-toast";

export function useResendOtp(){
  

    return useMutation({
        mutationFn:(data:ResendOtpRequest)=>authService.ResendOtp(data),

        onSuccess:()=>{
            toast.success("OTP reseend")   
        },
        onError:()=>{
            toast.error("Failed to send Resent otp")
        }
    })
}