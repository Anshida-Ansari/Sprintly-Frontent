import type React from "react";

interface TableColumn<T> {
	title: string;
	key: keyof T | string;
	render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
	columns: TableColumn<T>[];
	data: T[];
	actions?: (item: T) => React.ReactNode;
}

export function Table<T>({ columns, data, actions }: TableProps<T>) {
	return (
		<table className="min-w-full border border-gray-200">
			<thead className="bg-gray-100">
				<tr>
					{columns.map((col) => (
						<th
							key={col.key as string}
							className="px-4 py-2 text-left text-gray-700"
						>
							{col.title}
						</th>
					))}
					{actions && (
						<th className="px-4 py-2 text-left text-gray-700">Actions</th>
					)}
				</tr>
			</thead>
			<tbody>
				{data.map((row, idx) => (
					<tr
						key={(row as any).id || (row as any)._id || idx}
						className="border-t border-gray-200"
					>
						{columns.map((col) => (
							<td key={col.key as string} className="px-4 py-2">
								{col.render ? col.render(row) : (row as any)[col.key]}
							</td>
						))}
						{actions && <td className="px-4 py-2">{actions(row)}</td>}
					</tr>
				))}
			</tbody>
		</table>
	);
}
