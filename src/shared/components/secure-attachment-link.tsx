import { Loader2, Paperclip } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { subtaskService } from "../../modules/admin/services/subtask.service";

interface SecureAttachmentLinkProps {
	fileUrl: string;
	fileName: string;
}

export function SecureAttachmentLink({
	fileUrl,
	fileName,
}: SecureAttachmentLinkProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleDownload = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (isLoading) return;
		setIsLoading(true);

		try {
			const response = await subtaskService.getDownloadUrl(fileUrl);

			if (response.success && response.data) {
				const signedUrl = response.data;
				window.open(signedUrl, "_blank", "noopener,noreferrer");
			} else {
				throw new Error("Invalid response from server");
			}
		} catch (error: any) {
			console.error("Failed to fetch secure download URL:", error);
			toast.error(error.response?.data?.message || "Failed to open securely");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			onClick={handleDownload}
			disabled={isLoading}
			className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all shadow-sm max-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed group text-left"
			title={fileName}
		>
			{isLoading ? (
				<Loader2 size={12} className="shrink-0 animate-spin text-indigo-500" />
			) : (
				<Paperclip
					size={12}
					className="shrink-0 text-gray-400 group-hover:text-indigo-500 transition-colors"
				/>
			)}
			<span className="truncate">{fileName}</span>
		</button>
	);
}
