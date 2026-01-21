    import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProjects } from '../hooks/useProjects';
import { useGetMembers } from '../hooks/useGetmembers';
import { useMeetings } from '../hooks/useMeetings';
import { X, Calendar, Video, Users, Check } from 'lucide-react';

interface ScheduleMeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    title: string;
    projectId: string;
    date: string;
    type: "single" | "group";
    participants: string[];
}

export default function ScheduleMeetingModal({ isOpen, onClose }: ScheduleMeetingModalProps) {
    const { data: projectsRes } = useProjects({ page: 1, limit: 100 });
    const { data: membersRes } = useGetMembers({ page: 1, limit: 100 });
    const { scheduleMeeting, isScheduling } = useMeetings();
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

    const projects = projectsRes?.data || [];
    const members = membersRes?.data || [];

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            type: 'group'
        }
    });


    const toggleParticipant = (userId: string) => {
        setSelectedParticipants(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const onSubmit = (data: FormData) => {
        scheduleMeeting({
            ...data,
            participants: selectedParticipants
        }, {
            onSuccess: () => {
                reset();
                setSelectedParticipants([]);
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center p-8 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Schedule Meeting</h2>
                        <p className="text-gray-500 font-bold">Organize a session with your team</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-600 transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-1">Meeting Title</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                <Video size={20} />
                            </div>
                            <input
                                {...register("title", { required: "Title is required" })}
                                placeholder="e.g. Daily Standup / Sprint Review"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl font-bold transition-all outline-none"
                            />
                        </div>
                        {errors.title && <p className="text-rose-500 text-xs font-bold mt-1 ml-1">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 ml-1">Select Project</label>
                            <select
                                {...register("projectId", { required: "Project is required" })}
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl font-bold transition-all outline-none appearance-none"
                            >
                                <option value="">Select Project</option>
                                {projects?.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 ml-1">Date & Time</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Calendar size={20} />
                                </div>
                                <input
                                    type="datetime-local"
                                    {...register("date", { required: "Date is required" })}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl font-bold transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-black text-gray-700 ml-1 flex items-center gap-2">
                            <Users size={18} /> Assign Members
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {members.map((member: any) => (
                                <button
                                    key={member.id}
                                    type="button"
                                    onClick={() => toggleParticipant(member.id)}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold ${selectedParticipants.includes(member.id)
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                                        : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${selectedParticipants.includes(member.id) ? 'bg-indigo-600 text-white' : 'bg-gray-100'
                                        }`}>
                                        {selectedParticipants.includes(member.id) && <Check size={14} />}
                                    </div>
                                    <span>{member.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </form>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-white hover:bg-gray-100 text-gray-700 rounded-2xl font-black border border-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isScheduling}
                        onClick={handleSubmit(onSubmit)}
                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                    >
                        {isScheduling ? 'Scheduling...' : 'Schedule Meeting'}
                    </button>
                </div>
            </div>
        </div>
    );
}
