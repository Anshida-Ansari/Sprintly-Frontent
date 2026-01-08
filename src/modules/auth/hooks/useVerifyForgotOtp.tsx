import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.services";
import toast from "react-hot-toast";

export function useVerifyForgotOtp() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: { email: string, otp: string }) => authService.verifyForgotOtp(data),
        onSuccess: () => {
            toast.success("OTP Verified Successfully");
            navigate("/reset-password");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Invalid OTP");
        }
    });
}
