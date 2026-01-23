import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.services";
import { UserAuth } from "../store/store";

export function useGetMe() {
	const login = UserAuth((s) => s.login);
	const logout = UserAuth((s) => s.logout);

	return useQuery({
		queryKey: ["me"],
		queryFn: authService.getMe,
		retry: 1,
		enabled: !!localStorage.getItem("access_token"),

		meta: {
			onSuccess: (data: any) => {
				login(data.user, localStorage.getItem("access_token")!);
			},
			onError: () => {
				logout();
			},
		},
	});
}
