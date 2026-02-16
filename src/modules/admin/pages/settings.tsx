import { Github, Link2, Settings as SettingsIcon, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useGitHubStatus } from "../hooks/useGitHubStatus";
import { useDisconnectGitHub } from "../hooks/useDisconnectGitHub";
import { githubService } from "../services/github.service";
import { useState } from "react";

export default function Settings() {
    const { data: githubStatus, isLoading } = useGitHubStatus();
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
                                                                <span className="font-mono">@{githubStatus.githubUsername}</span>
                                                            </p>
                                                            {githubStatus.githubOrganization && (
                                                                <p className="text-emerald-700">
                                                                    <span className="font-semibold">Organization:</span>{" "}
                                                                    {githubStatus.githubOrganization}
                                                                </p>
                                                            )}
                                                            {githubStatus.connectedAt && (
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

                        {/* Placeholder for future integrations */}
                        <div className="mt-4 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
                            <p className="text-sm text-gray-500">
                                More integrations coming soon...
                            </p>
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
