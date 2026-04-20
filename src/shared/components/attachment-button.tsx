import { Loader2, Paperclip } from "lucide-react";
import type React from "react";
import { useRef } from "react";
import { useAttachments } from "../hooks/useAttachments";

interface AttachmentButtonProps {
	subtaskId: string;
	userStoryId?: string;
	variant?: "icon" | "full";
}

export function AttachmentButton({
	subtaskId,
	userStoryId,
	variant = "icon",
}: AttachmentButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const attachMutation = useAttachments(subtaskId, userStoryId);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		attachMutation.mutate(file);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	if (variant === "icon") {
		return (
			<div className="relative flex items-center">
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					className="hidden"
					accept="image/*,.pdf,.doc,.docx"
				/>
				<button
					onClick={() => fileInputRef.current?.click()}
					disabled={attachMutation.isPending}
					title="Attach File"
					className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
				>
					{attachMutation.isPending ? (
						<Loader2 size={14} className="animate-spin text-indigo-600" />
					) : (
						<Paperclip size={14} />
					)}
				</button>
			</div>
		);
	}

	return (
		<div className="relative">
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
				accept="image/*,.pdf,.doc,.docx"
			/>
			<button
				onClick={() => fileInputRef.current?.click()}
				disabled={attachMutation.isPending}
				className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
			>
				{attachMutation.isPending ? (
					<>
						<Loader2 size={14} className="animate-spin text-indigo-600" />
						Uploading...
					</>
				) : (
					<>
						<Paperclip size={14} />
						Attach File
					</>
				)}
			</button>
		</div>
	);
}
