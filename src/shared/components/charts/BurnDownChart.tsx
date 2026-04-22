import { Clock, Target } from "lucide-react";
import type React from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface BurnDownChartProps {
	data: {
		labels: string[];
		ideal: number[];
		actual: number[];
	} | null;
	title?: string;
	description?: string;
	isLoading?: boolean;
	type: "hours" | "points";
	onTypeChange: (type: "hours" | "points") => void;
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white border border-indigo-100 p-4 rounded-2xl shadow-xl outline-none">
				<p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.1em] mb-2">
					{label}
				</p>
				<div className="space-y-2">
					{payload.map((entry: any) => (
						<div
							key={entry.name}
							className="flex items-center justify-between gap-8"
						>
							<span className="text-xs font-bold text-gray-500 uppercase tracking-tight flex items-center gap-1.5">
								<div
									className="w-2 h-2 rounded-full"
									style={{ backgroundColor: entry.color }}
								/>
								{entry.name}:
							</span>
							<span className="text-sm font-black text-gray-900">
								{entry.value} {unit}
							</span>
						</div>
					))}
				</div>
				{payload.length > 1 && payload[1].value > payload[0].value && (
					<div className="mt-3 pt-2 border-t border-gray-100">
						<p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
							<Clock size={12} /> Delay:{" "}
							{(payload[1].value - payload[0].value).toFixed(1)} {unit}
						</p>
					</div>
				)}
			</div>
		);
	}
	return null;
};

export const BurnDownChart: React.FC<BurnDownChartProps> = ({
	data,
	title = "Burn Down Chart",
	description = "Remaining work over time",
	isLoading = false,
	type,
	onTypeChange,
}) => {
	if (isLoading) {
		return (
			<div className="w-full bg-white border border-gray-100 shadow-sm rounded-[32px] p-8 animate-pulse">
				<div className="h-20 bg-gray-50 rounded-2xl mb-8" />
				<div className="h-[400px] bg-gray-50 rounded-2xl" />
			</div>
		);
	}

	if (!data || !data.labels || data.labels.length === 0) {
		return (
			<div className="w-full bg-white border border-gray-100 shadow-sm rounded-[32px] p-8">
				<div className="flex justify-between items-start mb-6">
					<div>
						<h3 className="text-2xl font-bold text-gray-900">{title}</h3>
						<p className="text-sm text-gray-500 font-medium">{description}</p>
					</div>
				</div>
				<div className="h-[400px] flex flex-col items-center justify-center text-gray-400">
					<div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
						<Target size={32} />
					</div>
					<p className="font-bold">No burn down data available yet.</p>
				</div>
			</div>
		);
	}

	const chartData = data.labels.map((label, index) => ({
		name: label,
		ideal: data.ideal[index],
		actual: data.actual[index],
	}));

	const unit = type === "hours" ? "hrs" : "pts";

	return (
		<div className="w-full bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-indigo-100/50 rounded-[2rem] p-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<div>
					<h3 className="text-2xl font-bold text-gray-900 tracking-tight">
						{title}
					</h3>
					<p className="text-sm text-gray-500 font-medium">{description}</p>
				</div>

				{/* Toggle Hooked Up to Parent State */}
				<div className="bg-gray-50/80 p-1.5 rounded-2xl flex items-center gap-1 border border-gray-100">
					<button
						onClick={() => onTypeChange("hours")}
						className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
							type === "hours"
								? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-100"
								: "text-gray-400 hover:text-gray-600"
						}`}
					>
						Hours
					</button>
					<button
						onClick={() => onTypeChange("points")}
						className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
							type === "points"
								? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-100"
								: "text-gray-400 hover:text-gray-600"
						}`}
					>
						Points
					</button>
				</div>
			</div>

			<div className="h-[400px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={chartData}
						margin={{
							top: 10,
							right: 10,
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid
							strokeDasharray="8 8"
							stroke="#f1f5f9"
							vertical={false}
						/>
						<XAxis
							dataKey="name"
							stroke="#94a3b8"
							tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
							tickMargin={15}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							stroke="#94a3b8"
							tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
							tickMargin={10}
							axisLine={false}
							tickLine={false}
						/>
						<Tooltip
							content={<CustomTooltip unit={unit} />}
							cursor={{
								stroke: "#4f46e5",
								strokeWidth: 1,
								strokeDasharray: "5 5",
							}}
						/>
						<Legend
							verticalAlign="top"
							align="right"
							iconType="circle"
							wrapperStyle={{
								paddingBottom: "30px",
								fontSize: "11px",
								fontWeight: 800,
								textTransform: "uppercase",
								letterSpacing: "0.05em",
							}}
						/>
						<Line
							type="monotone"
							dataKey="ideal"
							name="Ideal Burndown"
							stroke="#94a3b8"
							strokeWidth={3}
							strokeDasharray="8 8"
							dot={false}
							activeDot={{
								r: 4,
								fill: "#94a3b8",
								stroke: "#fff",
								strokeWidth: 2,
							}}
						/>
						<Line
							type="monotone"
							dataKey="actual"
							name="Actual Burndown"
							stroke="#4f46e5"
							strokeWidth={4}
							dot={{ r: 4, fill: "#fff", stroke: "#4f46e5", strokeWidth: 3 }}
							activeDot={{
								r: 6,
								fill: "#4f46e5",
								stroke: "#fff",
								strokeWidth: 3,
							}}
							animationDuration={1500}
							connectNulls
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
