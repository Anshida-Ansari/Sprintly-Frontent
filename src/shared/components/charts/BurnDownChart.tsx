import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface BurnDownDataPoint {
  date: string;
  remaining: number;
}

interface BurnDownChartProps {
  data: BurnDownDataPoint[];
  title?: string;
  description?: string;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-indigo-100 p-4 rounded-2xl shadow-xl outline-none">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-indigo-600 font-black text-lg">
          {payload[0].value} {payload[0].value === 1 ? 'hr' : 'hrs'} <span className="text-gray-400 font-medium text-xs">left</span>
        </p>
      </div>
    );
  }
  return null;
};

export const BurnDownChart: React.FC<BurnDownChartProps> = ({ 
  data, 
  title = "Burn Down Chart", 
  description = "Remaining work hours over time",
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-gray-100 shadow-sm rounded-[32px] p-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 font-medium">{description}</p>
        </div>
        <div className="h-[400px] flex items-center justify-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-3 w-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="h-3 w-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-3 w-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white border border-gray-100 shadow-sm rounded-[32px] p-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 font-medium">{description}</p>
        </div>
        <div className="h-[400px] flex flex-col items-center justify-center text-gray-400">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </div>
          <p className="font-bold">No burn down data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-indigo-100/50 rounded-[2rem] p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-500 font-medium">{description}</p>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              tickMargin={15}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
              label={{ 
                value: 'Remaining Hours', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#cbd5e1', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: "20px" }} />
            <Area
              type="monotone"
              dataKey="remaining"
              name="Remaining Effort"
              stroke="#4f46e5"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorRemaining)"
              animationDuration={2000}
              dot={{ r: 4, fill: '#fff', stroke: '#4f46e5', strokeWidth: 3 }}
              activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
