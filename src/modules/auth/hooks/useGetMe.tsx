import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authService } from "../services/auth.services";
import { UserAuth } from "../store/store";

export function useGetMe() {
	const login = UserAuth((s) => s.login);
	const logout = UserAuth((s) => s.logout);
	const token = UserAuth((s) => s.token);

	const query = useQuery({
		queryKey: ["me"],
		queryFn: authService.getMe,
		retry: 1,
		enabled: !!token,
	});

	useEffect(() => {
		if (query.isSuccess && query.data) {
			const user = query.data?.data?.user ?? query.data?.user;
			if (user) {
				login(user, token!);
			}
		}
	}, [query.isSuccess, query.data, login, token]);

	useEffect(() => {
		if (query.isError) {
			logout();
		}
	}, [query.isError, logout]);

	return query;
}
