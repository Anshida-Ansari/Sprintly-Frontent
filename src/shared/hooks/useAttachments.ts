import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { subtaskService } from "../../modules/admin/services/subtask.service";

export const useAttachments = (subtaskId: string, userStoryId?: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file: File) => {
			const { data } = await subtaskService.getUploadUrl({
				fileName: file.name,
				fileType: file.type,
			});

			const { uploadUrl, fileUrl } = data;

			await axios.put(uploadUrl, file, {
				headers: {
					"Content-Type": file.type,
				},
			});

			const result = await subtaskService.addAttachment(subtaskId, {
				fileUrl,
				fileName: file.name,
			});

			return result;
		},
		onSuccess: (res: any) => {
			if (userStoryId) {
				queryClient.invalidateQueries({ queryKey: ["subtasks", userStoryId] });
			}
			queryClient.invalidateQueries({ queryKey: ["active-sprint-stories"] });
			queryClient.invalidateQueries({ queryKey: ["my-user-stories"] });
			toast.success(res.message || "File attached successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to attach file");
		},
	});
};
