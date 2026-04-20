import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileService } from "../services/profile.service";
import type { UserProfile } from "../types/profile.types";

export const useGetProfile = (companyId: string | undefined) => {
	return useQuery({
		queryKey: ["userProfile", companyId],
		queryFn: () => {
			if (!companyId) throw new Error("Company ID is required");
			return profileService.getProfile(companyId);
		},
		enabled: !!companyId,
	});
};

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			companyId,
			payload,
		}: {
			companyId: string;
			payload: Partial<UserProfile>;
		}) => profileService.updateProfile(companyId, payload),
		onSuccess: (data, variables) => {
			toast.success(data.message || "Profile updated successfully");
			queryClient.invalidateQueries({
				queryKey: ["userProfile", variables.companyId],
			});
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to update profile");
		},
	});
};
