// modules/auth/pages/MemberAccept.tsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyInvitation } from "../../admin/hooks/useVerifyInvitation";
import { useSetPassword } from "../../admin/hooks/usesetPassword";
import SetPasswordForm from "../../auth/components/Password/set.password";
import toast from "react-hot-toast";

export default function MemberAccept() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { mutate: verifyToken, data: responseData, isPending: verifying, isError: verifyError } = useVerifyInvitation();
  const { mutate: setPassword, isPending: setting } = useSetPassword();
  const inviteData = responseData?.data;
console.log("Invite data from verify:", inviteData);
  useEffect(() => {
    if (!token) {
      toast.error("Invalid invitation link");
      navigate("/login");
      return;
    }
    verifyToken(token);
  }, [token, verifyToken, navigate]);

  const handleSetPassword = (password: string, confirmPassword: string) => {
    setPassword(
      { token: token!, password, confirmPassword },
      {
        onSuccess: () => {
          toast.success("Account created successfully! Please log in.");
          navigate("/login");
        },
      }
    );
  };

  // Loading
  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your invitation...</p>
        </div>
      </div>
    );
  }

  // Error
  if (verifyError || !inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h1>
          <p className="text-gray-600 mb-6">
            This invitation link is no longer valid. Please contact your team admin to send a new invitation.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Valid token → show form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <div className="flex items-center gap-2">
          <div className="text-indigo-600 text-2xl font-bold">&lt;/&gt;</div>
          <span className="text-2xl font-bold text-gray-800">Sprintly</span>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Sprintly!</h1>
            <p className="text-gray-600">
              You've been invited to join your team. Set your password to get started.
            </p>
          </div>

          {/* Read-only info */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={inviteData?.name || ""}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={inviteData?.email || ""}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700"
              />
            </div>
          </div>

          {/* Reusable Form */}
          <SetPasswordForm onSubmit={handleSetPassword} isLoading={setting} />
        </div>
      </div>
    </div>
  );
}