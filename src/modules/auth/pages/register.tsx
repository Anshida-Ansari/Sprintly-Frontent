import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, ShieldCheck, Building2, User, Mail, Lock } from "lucide-react";

export default function Register() {
  const { mutate, isPending } = useRegister();
  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col font-sans antialiased text-slate-900">
      {/* Top Navigation Bar - Matching Login */}
      <nav className="p-8 flex justify-between items-center w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="font-black text-2xl tracking-tighter text-slate-900">
            Sprintly<span className="text-blue-600">.</span>
          </span>
        </div>
        <Link to="/login" className="text-[11px] font-black tracking-widest text-slate-400 hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1 uppercase">
          Back to Sign In
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 mb-12">
        <div className="w-full max-w-[540px]">
          
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-black tracking-tighter leading-[0.85] mb-4">
              BUILD YOUR <span className="text-blue-600">TEAM.</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Join 1,000+ engineering teams managing sprints on Sprintly.
            </p>
          </div>

          {/* Industrial Register Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Admin Name */}
              <div className="group relative border-2 border-slate-100 rounded-2xl p-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all bg-slate-50/30">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 mb-1">Lead Admin</p>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-300" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent outline-none font-bold text-md placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="group relative border-2 border-slate-100 rounded-2xl p-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all bg-slate-50/30">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 mb-1">Company</p>
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-slate-300" />
                  <input
                    name="companyName"
                    type="text"
                    placeholder="Acme Corp"
                    value={form.companyName}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent outline-none font-bold text-md placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="group relative border-2 border-slate-100 rounded-2xl p-4 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all bg-slate-50/30">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 mb-1">Work Email</p>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-300" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Password */}
              <div className="group relative border-2 border-slate-100 rounded-2xl p-4 focus-within:border-blue-600 transition-all bg-slate-50/30">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 mb-1">Password</p>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-300"
                />
              </div>

              {/* Confirm Password */}
              <div className="group relative border-2 border-slate-100 rounded-2xl p-4 focus-within:border-blue-600 transition-all bg-slate-50/30">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 mb-1">Verify</p>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none font-bold text-lg placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-between px-10 hover:bg-blue-600 transition-all duration-500 group shadow-2xl shadow-blue-100 active:scale-95 disabled:opacity-50 mt-6"
            >
              <span className="font-black text-2xl tracking-tighter italic">CREATE SPACE</span>
              {isPending ? (
                <Loader2 className="animate-spin text-blue-400" size={28} />
              ) : (
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Trust Footer */}
          <div className="mt-12 flex justify-center gap-8 opacity-30 grayscale contrast-125">
             <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <ShieldCheck size={14} />
                GDPR COMPLIANT
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <Lock size={14} />
                AES-256 SECURED
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}