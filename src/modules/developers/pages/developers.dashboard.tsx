import { Play, CheckCircle2, Github, Timer, ArrowUpRight, Target } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* 1. Header with System Stats */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Main Console</h1>
          <p className="text-gray-500 mt-2 font-mono text-sm uppercase tracking-widest">User: John_Doe // Rank: Senior_L4</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
             <p className="text-xs text-gray-600 font-bold uppercase">Uptime</p>
             <p className="text-white font-mono">142:32:04</p>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-right">
             <p className="text-xs text-gray-600 font-bold uppercase">Success Rate</p>
             <p className="text-emerald-500 font-mono">98.2%</p>
          </div>
        </div>
      </header>

      {/* 2. Grid Bento - The "Fab" Elements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Focused Card */}
        <div className="lg:col-span-2 group bg-gradient-to-br from-[#16161A] to-[#0D0D0F] p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <Target size={24} />
             </div>
          </div>
          <p className="text-indigo-500 text-xs font-black uppercase tracking-[0.3em] mb-4">Active Sprint</p>
          <h2 className="text-3xl text-white font-bold max-w-sm mb-6 leading-tight">Implement WebSockets for Real-time Updates</h2>
          
          <div className="flex items-center gap-6">
             <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                <Play size={18} fill="black" /> Continue Coding
             </button>
             <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                <Timer size={16} /> 04:20:00 REMAINING
             </div>
          </div>
          
          {/* Subtle Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        </div>

        {/* Small Action Card */}
        <div className="bg-[#111113] p-8 rounded-3xl border border-white/5 flex flex-col justify-between group">
           <div>
              <div className="flex justify-between items-start mb-4">
                 <Github size={32} className="text-white group-hover:text-indigo-400 transition-colors" />
                 <ArrowUpRight size={20} className="text-gray-700" />
              </div>
              <h3 className="text-white font-bold">Latest Commit</h3>
              <p className="text-sm text-gray-500 mt-2 font-mono">fix(auth): solved token expiration race condition</p>
           </div>
           <div className="mt-6 pt-6 border-t border-white/5">
              <span className="text-[10px] font-black text-gray-600 uppercase">Hash</span>
              <p className="text-xs text-indigo-400 font-mono truncate">7f8a92b10cd4e5f...</p>
           </div>
        </div>
      </div>

      {/* 3. Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Points Earned", val: "1,240", sub: "TOP 5%", color: "indigo" },
          { label: "Tasks Done", val: "42", sub: "THIS MONTH", color: "emerald" },
          { label: "Reviews", val: "12", sub: "PENDING", color: "amber" },
          { label: "Rank", val: "Gold", sub: "LVL 14", color: "purple" },
        ].map((item, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.04] transition-all">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{item.label}</p>
            <div className="flex items-end justify-between mt-2">
               <h3 className="text-2xl font-bold text-white tracking-tighter">{item.val}</h3>
               <span className={`text-[10px] font-bold text-${item.color}-500 bg-${item.color}-500/10 px-2 py-0.5 rounded`}>
                 {item.sub}
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Activity Stream */}
      <div className="bg-[#0D0D0F] rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h3 className="text-white font-bold flex items-center gap-2">
            <CheckCircle2 size={18} className="text-indigo-500" /> Activity Stream
          </h3>
          <span className="text-[10px] text-gray-600 font-mono">REC_STATUS: LIVE</span>
        </div>
        <div className="divide-y divide-white/5">
           {[1, 2, 3].map(i => (
             <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
                   <p className="text-sm text-gray-300">New story <span className="text-white font-bold">#402-Landing-Page</span> assigned to you.</p>
                </div>
                <span className="text-xs text-gray-600 font-mono">2m ago</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}