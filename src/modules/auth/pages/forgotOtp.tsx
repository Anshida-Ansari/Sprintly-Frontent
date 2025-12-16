// pages/ForgotPasswordOtpPage.tsx
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput, { type OtpInputRef } from "../components/Otp/Otp.input";
import { useVerifyOtp } from "../hooks/useVerify";
import { useResendOtp } from "../hooks/useResendotp";
import toast from "react-hot-toast";

const ForgotPasswordOtpPage = () => {
  const [otpValue, setOtpValue] = useState("");
  const [error, setError] = useState("");
  const otpInputRef = useRef<OtpInputRef>(null);
  const navigate = useNavigate();

  const email = localStorage.getItem("forgot_email"); // Store email after user submits forgot form

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  useEffect(() => {
    if (!email) {
      toast.error("No email found. Please enter your email again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = () => {
    if (otpValue.length !== 6) {
      setError("Enter all 6 digits");
      return;
    }

    verifyOtp(
      { email, otp: otpValue },
      {
        onSuccess: () => {
          toast.success("OTP Verified!");
          navigate("/reset-password"); // redirect to reset password page
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || "Invalid OTP");
          otpInputRef.current?.clear();
        },
      }
    );
  };

  const handleResend = () => {
    if (!email) return;
    resendOtp({ email }, { onSuccess: () => toast.success("OTP resent!") });
  };

  return (
    <div>
      <h1>Enter OTP for Forgot Password</h1>
      <OtpInput
        onChange={(val) => {
          setOtpValue(val);
          setError("");
        }}
        error={!!error}
        ref={otpInputRef}
      />
      {error && <p className="text-red-600">{error}</p>}
      <button onClick={handleSubmit} disabled={isVerifying}>
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </button>
      <button onClick={handleResend} disabled={isResending}>
        Resend OTP
      </button>
    </div>
  );
};

export default ForgotPasswordOtpPage;
