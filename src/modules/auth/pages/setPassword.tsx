import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyInvitation } from "../../admin/hooks/useVerifyInvitation";
import { useSetPassword } from "../../admin/hooks/usesetPassword";
import SetPasswordForm from "../../auth/components/Password/set.password";
import { Loader2, UserPlus, AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function MemberAccept() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { mutate: verifyToken, data: responseData, isPending: verifying, isError: verifyError } = useVerifyInvitation();
  const { mutate: setPassword, isPending: setting } = useSetPassword();
  const inviteData = responseData?.data;

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
          toast.success("Account created! Welcome to the team.");
          navigate("/login");
        },
      }
    );
  };

  // --- LOADING STATE ---
  if (verifying) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center font-sans antialiased">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-black text-sm uppercase tracking-[0.2em] text-slate-400">Authenticating Ticket...</p>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (verifyError || !inviteData) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col font-sans antialiased text-slate-900">
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-[480px] text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full text-red-500">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight leading-[0.9]">
                LINK <span className="text-red-500">EXPIRED.</span><br />
                ACCESS DENIED.
              </h1>
              <p className="text-slate-500 font-medium text-lg mx-auto max-w-[320px]">
                This invitation is no longer valid or has already been used.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 font-black text-xl tracking-tight"
            >
              <ArrowLeft size={20} /> RETURN TO LOGIN
            </button>
          </div>
        </main>
      </div>
    );
  }

  // --- SUCCESS/FORM STATE ---
  return (
    <div className="min-h-screen w-full bg-white flex flex-col font-sans antialiased text-slate-900">
      {/* Top Navigation Bar */}
      <nav className="p-8 flex justify-between items-center w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-black text-2xl tracking-tighter text-slate-900">
            Sprintly<span className="text-blue-600">.</span>
          </span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[480px]">
          {/* Bold Heading Section */}
          <div className="mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
              <UserPlus size={14} className="text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Team Invitation</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight leading-[0.9]">
              WELCOME <span className="text-blue-600">ABOARD.</span><br />
              SETUP ACCOUNT.
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Finish setting up your profile to join the workspace.
            </p>
          </div>

          <div className="space-y-4">
            {/* Read-only Identity info using the same style as login inputs */}
            <div className="group relative border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 transition-all duration-300">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Assigned Name</p>
              <input
                type="text"
                value={inviteData?.name || ""}
                readOnly
                className="w-full bg-transparent outline-none font-bold text-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="group relative border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 transition-all duration-300">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Corporate Email</p>
              <input
                type="email"
                value={inviteData?.email || ""}
                readOnly
                className="w-full bg-transparent outline-none font-bold text-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Password Form - Ensure this component uses the same Button style internally */}
            <div className="pt-4">
               <SetPasswordForm onSubmit={handleSetPassword} isLoading={setting} />
            </div>
          </div>

          {/* Minimal Footer Info */}
          <div className="mt-12 pt-8 border-t border-slate-50 flex items-center gap-8 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            <span>SECURE JOIN</span>
            <span>v2.0.4</span>
            <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-500">Server Active</span>
          </div>
        </div>
      </main>
    </div>
  );
}