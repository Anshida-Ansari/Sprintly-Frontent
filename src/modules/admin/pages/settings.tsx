import { Github, Link2, Settings as SettingsIcon, X, CheckCircle2, AlertCircle, Zap, CreditCard, ChevronRight } from "lucide-react";
import { useGitHubStatus } from "../hooks/useGitHubStatus";
import { useSubscriptionStatus } from "../hooks/useSubscription";
import { useDisconnectGitHub } from "../hooks/useDisconnectGitHub";
import { githubService } from "../services/github.service";
import { useState } from "react";

export default function Settings() {
    const { data: githubStatus, isLoading } = useGitHubStatus();
    const { data: subscription } = useSubscriptionStatus();
    const disconnectMutation = useDisconnectGitHub();
    const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

    const handleConnectGitHub = async () => {
        try {
            const { authUrl } = await githubService.initiateConnection();
            window.location.href = authUrl;
        } catch (error) {
            console.error("Failed to initiate GitHub connection:", error);
        }
    };

    const handleDisconnect = () => {
        disconnectMutation.mutate();
        setShowDisconnectConfirm(false);
    };

    const isConnected = githubStatus?.isConnected || false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-xl">
                            <SettingsIcon size={28} className="text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                            <p className="text-sm text-gray-600">
                                Manage your integrations and preferences
                            </p>
                        </div>
                    </div>
                </div>

                {/* Integrations Section */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Link2 size={20} className="text-gray-700" />
                            <h2 className="text-xl font-bold text-gray-900">Integrations</h2>
                        </div>
                        {githubStatus?.isConnected ? (
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Connected to GitHub</h3>
                                    <p className="text-sm text-gray-500">
                                        Key: {githubStatus?.key?.substring(0, 8)}...
                                    </p>
                                </div>
                            </div>
                        ) : null}

                        {/* GitHub Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center">
                                            <Github size={28} className="text-white" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                    GitHub
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Automatically create private repositories when you create new projects
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        {isLoading ? (
                                            <div className="flex items-center gap-2 py-3">
                                                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm text-gray-600">Checking connection...</span>
                                            </div>
                                        ) : isConnected ? (
                                            <div className="space-y-4">
                                                {/* Connected Status */}
                                                <div className="flex items-start gap-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                                                    <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-sm font-bold text-emerald-800">
                                                                Connected
                                                            </span>
                                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                        </div>
                                                        <div className="space-y-1 text-sm">
                                                            <p className="text-emerald-700">
                                                                <span className="font-semibold">Account:</span>{" "}
                                                                <span className="font-mono">@{githubStatus?.githubUsername}</span>
                                                            </p>
                                                            {githubStatus?.githubOrganization && (
                                                                <p className="text-emerald-700">
                                                                    <span className="font-semibold">Organization:</span>{" "}
                                                                    {githubStatus.githubOrganization}
                                                                </p>
                                                            )}
                                                            {githubStatus?.connectedAt && (
                                                                <p className="text-xs text-emerald-600 mt-1">
                                                                    Connected on{" "}
                                                                    {new Date(githubStatus.connectedAt).toLocaleDateString("en-US", {
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric",
                                                                    })}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Disconnect Button */}
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setShowDisconnectConfirm(true)}
                                                        disabled={disconnectMutation.isPending}
                                                        className="px-5 py-2.5 border-2 border-red-200 bg-red-50 text-red-700 rounded-xl font-semibold hover:bg-red-100 hover:border-red-300 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        <AlertCircle size={16} />
                                                        {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect GitHub"}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="pt-2">
                                                <button
                                                    onClick={handleConnectGitHub}
                                                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
                                                >
                                                    <Github size={20} />
                                                    Connect GitHub
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Subscription Section */}
                    <div className="pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            <Zap size={20} className="text-gray-700" />
                            <h2 className="text-xl font-bold text-gray-900">Billing & Subscription</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Current Plan Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${subscription?.data?.currentPlan === 'PRO' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                                                <CreditCard size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Plan</p>
                                                <h3 className="text-xl font-black text-gray-900">{subscription?.data?.currentPlan || 'FREE'} Plan</h3>
                                            </div>
                                        </div>
                                        {subscription?.data?.currentPlan === 'PRO' ? (
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full uppercase tracking-tight">Active</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-black rounded-full uppercase tracking-tight">Free Tier</span>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm font-bold mb-2">
                                                <span className="text-gray-600">Project Usage</span>
                                                <span className="text-gray-900">
                                                    {subscription?.data?.projectCount} / {subscription?.data?.projectLimit === -1 ? '∞' : subscription?.data?.projectLimit}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ${subscription?.data?.isLimitReached ? 'bg-orange-500' : 'bg-indigo-600'}`}
                                                    style={{ width: `${Math.min(((subscription?.data?.projectCount || 0) / (subscription?.data?.projectLimit === -1 ? (subscription?.data?.projectCount || 1) : (subscription?.data?.projectLimit || 1))) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {subscription?.data?.currentPlan === 'FREE' && (
                                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                                                <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                                                    You're currently limited to 2 projects. Upgrade to Pro for unlimited project creation and advanced team features.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Plan Details / Renewal Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 h-full flex flex-col">
                                    <h4 className="font-bold text-gray-900 mb-4 tracking-tight">Plan Benefits</h4>
                                    <ul className="space-y-3 flex-1">
                                        {[
                                            { text: 'Unlimited Projects', active: subscription?.data?.currentPlan === 'PRO' },
                                            { text: 'Priority Support', active: subscription?.data?.currentPlan === 'PRO' },
                                            { text: 'Advanced Analytics', active: subscription?.data?.currentPlan === 'PRO' },
                                            { text: 'Basic Project Management', active: true },
                                        ].map((benefit, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm">
                                                <div className={`w-1.5 h-1.5 rounded-full ${benefit.active ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                                                <span className={benefit.active ? 'text-gray-900 font-medium' : 'text-gray-400'}>{benefit.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <div className="mt-6 pt-6 border-t border-gray-100 flex-1 flex flex-col justify-end">
                                        {subscription?.data?.currentPlan === 'PRO' ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500 font-medium">Auto-renewal Status</span>
                                                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                                                        <CheckCircle2 size={14} />
                                                        Enabled
                                                    </span>
                                                </div>
                                                {subscription?.data?.subscriptionEndDate && (
                                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Next Billing Date</span>
                                                            <span className="text-sm font-black text-gray-900">
                                                                {new Date(subscription.data.subscriptionEndDate).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric"
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all group">
                                                <span className="text-sm font-bold">Compare all plans</span>
                                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disconnect Confirmation Modal */}
            {showDisconnectConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDisconnectConfirm(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in duration-200">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertCircle size={24} className="text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Disconnect GitHub?
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    This will remove your GitHub connection and stop automatic repository creation for new projects. You can reconnect anytime.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDisconnectConfirm(false)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDisconnectConfirm(false)}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDisconnect}
                                disabled={disconnectMutation.isPending}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 shadow-lg shadow-red-200"
                            >
                                {disconnectMutation.isPending ? "Disconnecting..." : "Yes, Disconnect"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
