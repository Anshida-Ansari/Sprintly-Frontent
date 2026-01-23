import { useQuery } from "@tanstack/react-query";
import { inviteMemberService } from "../services/invite.member.sevice";

export function useGetMembers({
	page,
	limit,
	search,
}: {
	page: number;
	limit: number;
	search?: string;
}) {
	return useQuery({
		queryKey: ["members", page, limit, search],
		queryFn: () => inviteMemberService.getMembers({ page, limit, search }),
	});
}
