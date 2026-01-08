import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { ForgotRequest } from "../types/types";
import { authService } from "../services/auth.services";
import toast from "react-hot-toast";

export function useForgotPassword() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (data: ForgotRequest) => authService.ForgotPassword(data),
        onSuccess: (res) => {
            toast.success(res.message || "Password reset OTP sent")
            navigate('/forgot-otp')
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to send reset email");
        }
    })
}