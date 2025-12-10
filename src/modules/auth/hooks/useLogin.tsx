import {  useNavigate } from "react-router-dom";
import { UserAuth } from "../store/store";
import { useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "../types/types";
import { authService } from "../services/auth.services";
import toast from "react-hot-toast";

export function useLogin(){
    const navigate = useNavigate()
    const loginUser = UserAuth((s)=>s.login)

    return useMutation({
        mutationFn:(data:LoginRequest)=>authService.Login(data),

        onSuccess:(res)=>{
            toast.success("Login successfull")
            loginUser(res.user,res.accessToken)

            navigate('/dashboard')
            
        },
        onError:(err:any)=>{
          toast.error(err.response?.data?.message || "Login failed")
        },
    })
}