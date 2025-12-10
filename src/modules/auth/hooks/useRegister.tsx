import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { RegisterRequest } from "../types/types";
import { authService } from "../services/auth.services";
import toast from "react-hot-toast";

export function useRegister(){
    const navigate = useNavigate()

    return useMutation({
        mutationFn:(data:RegisterRequest)=>authService.Register(data),

        onSuccess:(res)=>{
            toast.success("Registered successfully")

    
        if(res.otpRequired){
            navigate("/otp",{state:{email:res.user.email}})
        }
    },
    onError:(err:any)=>{
        toast.error(err.response?.data?.message || "Registration failed")
    },

       
    })
}