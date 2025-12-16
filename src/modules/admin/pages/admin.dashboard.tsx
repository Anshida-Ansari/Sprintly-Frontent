import  { useState } from 'react';
import { FolderOpen, Play, Clock, Trophy, ChevronRight, Plus, RefreshCw, Search, Bell } from 'lucide-react';
import InviteMemberBtn from '../components/invite.member.btn';
import { useInviteMember } from '../hooks/useInviteMember';
import InviteMemberModal from '../components/invite.modal';

export default function AdminDashboard() {

  const [isModalOpen,setIsModalOpen] = useState(false)
  const {mutate:inviteMember,isPending} = useInviteMember()

  const handleInvite = (data: { name: string; email: string }) => {
    inviteMember(data, {
      onSuccess: () => {
        setIsModalOpen(false); 
      },
    });
  };
  const stats = [
    { label: "Active Projects", value: "24", icon: FolderOpen, color: "bg-blue-50", textColor: "text-blue-600", iconBg: "bg-blue-100" },
    { label: "Running Sprints", value: "8", icon: Play, color: "bg-green-50", textColor: "text-green-600", iconBg: "bg-green-100" },
    { label: "Pending Reviews", value: "12", icon: Clock, color: "bg-orange-50", textColor: "text-orange-600", iconBg: "bg-orange-100" },
  ];

  const recentActivity = [
    { user: "Alice Johnson", action: "updated Task #21 to In Review", time: "2 minutes ago", avatar: "AJ", color: "bg-pink-500" },
    { user: "Bob Wilson", action: "merged PR to Project Sprint 2", time: "15 minutes ago", avatar: "BW", color: "bg-blue-500" },
    { user: "Sprint 'UI Revamp'", action: "started today", time: "1 hour ago", avatar: "UI", color: "bg-indigo-600" },
    { user: "Emma Davis", action: "completed Authentication Module", time: "3 hours ago", avatar: "ED", color: "bg-green-500" },
    { user: "Mike Rodriguez", action: "created new project 'Mobile App Redesign'", time: "5 hours ago", avatar: "MR", color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80 text-sm"
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            <button className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                JA
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">John Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="px-8 pb-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-xl text-gray-600 mb-2">Welcome back,</h2>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">John Admin 👋</h3>
          <p className="text-gray-600 text-lg">Here's what's happening with your workspace today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.color} rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-xl`}>
                    <Icon size={24} className={stat.textColor} strokeWidth={2} />
                  </div>
                </div>
                <h3 className={`text-4xl font-bold ${stat.textColor} mb-2`}>{stat.value}</h3>
                <p className={`text-sm font-semibold ${stat.textColor}`}>{stat.label}</p>
              </div>
            );
          })}
          
          {/* Best Performer Card */}
          <div className="bg-purple-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Trophy size={24} className="text-purple-600" strokeWidth={2} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-purple-600 mb-2">Sarah Chen</h3>
            <p className="text-sm font-semibold text-purple-600 mb-1">Best Performer</p>
            <p className="text-xs text-purple-500">Outstanding work this sprint</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 transition-colors">
                View All
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="space-y-5">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className={`${activity.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm shadow-sm`}>
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md text-base">
                <Plus size={20} strokeWidth={2.5} />
                Create Project
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow-md text-base">
                <RefreshCw size={20} strokeWidth={2.5} />
                Create Sprint
              </button>
            
             <InviteMemberBtn onClick={() => setIsModalOpen(true)} />
              <InviteMemberModal
              isOpen={isModalOpen}
              onClose={()=>setIsModalOpen(false)}
              onSubmit={handleInvite}
              isLoading={isPending}
              
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}