import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserAuth } from "../../auth/store/store";
import { useGetProfile, useUpdateProfile } from "../hooks/useProfile";
import { Loader2, Save, Edit2, Github, Linkedin, MapPin, Phone, User, X, FolderKanban } from "lucide-react";
import type { UserProfile } from "../types/profile.types";

interface ProfileFormData extends Omit<UserProfile, "skills"> {
    skills?: string;
}

function InfoRow({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <span className={`text-sm font-semibold ${value ? "text-slate-800" : "text-slate-300 italic"}`}>
                {value || placeholder || "—"}
            </span>
        </div>
    );
}

export default function ProfilePage() {
    const user = UserAuth((state) => state.user);
    const { data: profileResponse, isLoading: isFetching } = useGetProfile(user?.companyId);
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit, reset } = useForm<ProfileFormData>();

    useEffect(() => {
        if (profileResponse?.data) {
            const profile = profileResponse.data;
            reset({
                ...profile,
                skills: profile.skills?.join(", ") || "",
            });
        }
    }, [profileResponse, reset]);

    const onSubmit = (data: ProfileFormData) => {
        if (!user?.companyId) return;

        const payload: Partial<UserProfile> = {
            ...data,
            skills: data.skills ? data.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        };

        updateProfile({ companyId: user.companyId, payload }, {
            onSuccess: () => setIsEditing(false),
        });
    };

    if (isFetching) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    const profile = profileResponse?.data;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Profile</h1>
                    <p className="text-slate-500 mt-1">Manage your professional identity and workspace settings.</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg"
                    >
                        <Edit2 size={16} />
                        Edit Profile
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            if (profileResponse?.data) {
                                const p = profileResponse.data;
                                reset({ ...p, skills: p.skills?.join(", ") || "" });
                            }
                        }}
                        className="flex items-center gap-2 bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                        <X size={16} />
                        Cancel
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 mb-4 border-4 border-white shadow-lg">
                            {profile?.avatarUrl ? (
                                <img src={profile.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-4xl uppercase">
                                    {user?.name?.[0] || "?"}
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-black text-slate-900">{user?.name}</h2>
                        <p className="text-indigo-600 font-bold text-sm tracking-wide uppercase mt-1">{user?.role}</p>
                        <div className="w-full h-px bg-slate-100 my-4" />
                        <div className="w-full space-y-3 text-sm text-slate-600 text-left">
                            <InfoRow label="Email" value={user?.email} />
                            <InfoRow label="Company" value={user?.companyName} placeholder="Not set" />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2">
                    {/* === VIEW MODE === */}
                    {!isEditing && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 md:p-8 space-y-8">
                                {/* About */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <User size={14} /> About
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <InfoRow label="Phone Number" value={profile?.phoneNumber} placeholder="Not provided" />
                                        <InfoRow label="Address" value={profile?.address} placeholder="Not provided" />
                                    </div>
                                    <InfoRow label="Bio" value={profile?.bio} placeholder="No bio added yet." />
                                </div>
                                <div className="w-full h-px bg-slate-100" />
                                {/* Professional */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <FolderKanban size={14} /> Professional Details
                                    </h3>
                                    <InfoRow
                                        label="Skills"
                                        value={profile?.skills?.length ? profile.skills.join(", ") : undefined}
                                        placeholder="No skills added yet."
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <InfoRow label="GitHub URL" value={profile?.github} placeholder="Not provided" />
                                        <InfoRow label="LinkedIn URL" value={profile?.linkedin} placeholder="Not provided" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === EDIT MODE === */}
                    {isEditing && (
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 md:p-8 space-y-8">
                                {/* About Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <User size={14} /> About
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Avatar URL</label>
                                            <input
                                                {...register("avatarUrl")}
                                                placeholder="https://example.com/avatar.jpg"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        {...register("phoneNumber")}
                                                        placeholder="+1 (555) 000-0000"
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        {...register("address")}
                                                        placeholder="City, Country"
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Bio</label>
                                            <textarea
                                                {...register("bio")}
                                                rows={4}
                                                placeholder="Write a short bio about yourself..."
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-slate-100" />

                                {/* Professional Details */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <FolderKanban size={14} /> Professional Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Skills <span className="text-slate-400 font-normal ml-1">(comma separated)</span>
                                            </label>
                                            <input
                                                {...register("skills")}
                                                placeholder="React, Node.js, TypeScript"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">GitHub URL</label>
                                                <div className="relative">
                                                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        {...register("github")}
                                                        placeholder="https://github.com/username"
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">LinkedIn URL</label>
                                                <div className="relative">
                                                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        {...register("linkedin")}
                                                        placeholder="https://linkedin.com/in/username"
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
