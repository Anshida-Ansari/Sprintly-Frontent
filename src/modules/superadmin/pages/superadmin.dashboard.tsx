import { useState } from 'react';
import { Building2, Users, TrendingUp, ChevronRight, ArrowUp, ArrowDown, Download, Plus } from 'lucide-react';

export default function SuperAdminDashboard() {
  const stats = [
    { label: 'Total Companies', value: '45', change: '+12%', trending: 'up', icon: Building2, color: 'indigo' },
    { label: 'Active Users', value: '320', change: '+8%', trending: 'up', icon: Users, color: 'emerald' },
    { label: 'Active Subscriptions', value: '80', change: '+15%', trending: 'up', icon: TrendingUp, color: 'violet' },
    { label: 'Churn Rate', value: '2.3%', change: '-2%', trending: 'down', icon: TrendingUp, color: 'orange' },
  ];

const recentCompanies = [
    { name: 'Company Acme Corp', user: 'John Doe', plan: 'Premium Plan', joined: '2023-09-01 9:00 AM', status: 'registered' },
    { name: 'TechStart Inc', user: 'User Alex Smith', plan: 'Standard Plan', joined: '2023-09-02 2:30 PM', status: 'added' },
    { name: 'Global Solutions', user: 'Sarah Johnson', plan: 'Basic Plan', joined: '2023-09-03 11:15 AM', status: 'registered' },
    { name: 'Innovation Labs', user: 'Mike Wilson', plan: 'Premium Plan', joined: '2023-09-04 4:45 PM', status: 'added' },
  ];

  const subscriptionData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 70 },
    { month: 'Mar', value: 72 },
    { month: 'Apr', value: 75 },
    { month: 'May', value: 78 },
    { month: 'Jun', value: 80 },
  ];

  const planDistribution = [
    { name: 'Premium Plan', count: 45, percentage: 56 },
    { name: 'Standard Plan', count: 25, percentage: 31 },
    { name: 'Basic Plan', count: 10, percentage: 13 },
  ];

  const maxValue = Math.max(...subscriptionData.map(d => d.value));

  return (
    <div className="space-y-8">
      {/* Dynamic Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here’s what’s happening with your platform today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm font-semibold">
            <Download size={18} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 text-sm font-semibold">
            <Plus size={18} /> Add Company
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={22} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trending === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.trending === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Insight Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Bar Growth */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 text-lg">Subscription Trends</h3>
            <select className="text-sm border-none bg-gray-50 rounded-lg focus:ring-0">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="space-y-6">
            {subscriptionData.map((item, index) => (
              <div key={index} className="group">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">{item.month}</span>
                  <span className="text-sm font-bold text-gray-900">{item.value} users</span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 group-hover:bg-indigo-600"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg mb-6">Plan Distribution</h3>
          <div className="space-y-8">
            {planDistribution.map((plan, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{plan.name}</p>
                    <p className="text-xl font-bold text-gray-900">{plan.count}</p>
                  </div>
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{plan.percentage}%</span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${plan.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white">
          <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
          <button className="text-indigo-600 text-sm font-bold hover:underline inline-flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentCompanies.map((company, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{company.name}</p>
                        <p className="text-xs text-gray-500">{company.user}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 group-hover:bg-white transition-colors">
                      {company.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {company.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}