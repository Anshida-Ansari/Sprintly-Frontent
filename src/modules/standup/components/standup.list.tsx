import { useListStandups } from "../hooks/useListStandup";

interface StandupListProps {
	projectId: string;
	sprintId: string;
}

export const StandupList = ({ projectId, sprintId }: StandupListProps) => {
	const { data, isLoading } = useListStandups(projectId, sprintId);

	if (isLoading) return <p>Loading...</p>;

	return (
		<div className="space-y-4">
			{data && data.length > 0 ? (
				data.map((s) => (
					<div key={s._id} className="p-4 border rounded-xl bg-gray-50">
						<p>
							<strong>Yesterday:</strong> {s.yesterday}
						</p>
						<p>
							<strong>Today:</strong> {s.today}
						</p>
						<p>
							<strong>Blockers:</strong> {s.blockers}
						</p>
					</div>
				))
			) : (
				<p className="text-gray-400 font-bold text-center">No standups yet</p>
			)}
		</div>
	);
};
