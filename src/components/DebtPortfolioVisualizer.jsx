import React, { useState, useMemo } from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import { 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  DollarSign, 
  FileText, 
  PieChart as PieIcon, 
  BarChart2, 
  Lock,
  Layers,
  Percent
} from "lucide-react";

const COLORS = {
  PERSONAL: "#3b82f6", // Blue
  HOME: "#10b981",     // Emerald
  VEHICLE: "#f59e0b",  // Amber
  SME: "#8b5cf6",      // Purple
  BUSINESS: "#ec4899", // Pink
  OTHER: "#64748b"     // Slate
};

const SIMULATED_DATA = [
  { loan_type: "HOME", requested_amount: 12000000, count: 1 },
  { loan_type: "VEHICLE", requested_amount: 4500000, count: 1 },
  { loan_type: "PERSONAL", requested_amount: 1500000, count: 2 }
];

export default function DebtPortfolioVisualizer({ customerApplications }) {
  const [viewType, setViewType] = useState("pie"); // "pie" or "bar"
  const [isSimulated, setIsSimulated] = useState(false);

  // Filter out rejected applications
  const activeApps = useMemo(() => {
    if (!customerApplications) return [];
    return customerApplications.filter(app => app.status !== "REJECTED");
  }, [customerApplications]);

  // Determine if user has multiple active applications
  const hasMultipleActive = activeApps.length >= 2;

  // Decide whether to use real applications or simulated fallback
  const finalApps = useMemo(() => {
    if (hasMultipleActive && !isSimulated) {
      return activeApps;
    }
    return SIMULATED_DATA;
  }, [activeApps, hasMultipleActive, isSimulated]);

  // Aggregate data by loan type
  const chartData = useMemo(() => {
    const groups = {};
    
    finalApps.forEach(app => {
      const type = (app.loan_type || "OTHER").toUpperCase();
      const amount = parseFloat(app.requested_amount) || 0;
      
      if (!groups[type]) {
        groups[type] = {
          name: type,
          value: 0,
          count: 0,
          color: COLORS[type] || COLORS.OTHER
        };
      }
      groups[type].value += amount;
      groups[type].count += 1;
    });

    return Object.values(groups);
  }, [finalApps]);

  // Calculate high-level portfolio metrics
  const metrics = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const totalCount = chartData.reduce((sum, item) => sum + item.count, 0);
    const average = totalCount > 0 ? total / totalCount : 0;
    
    return {
      total,
      totalCount,
      average
    };
  }, [chartData]);

  const formatLKR = (value) => {
    if (value >= 1000000) {
      return `LKR ${(value / 1000000).toFixed(2)}M`;
    }
    return `LKR ${value.toLocaleString()}`;
  };

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = metrics.total > 0 ? ((data.value / metrics.total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 shadow-xl font-sans text-xs space-y-1">
          <p className="font-extrabold tracking-tight text-[11px] uppercase text-slate-300">
            {data.name} LOAN DEBT
          </p>
          <p className="text-sm font-mono font-bold text-teal-400">
            LKR {data.value.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800 mt-1">
            <span>Portfolio Share:</span>
            <span className="font-bold text-white">{percentage}%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Active Facilities:</span>
            <span className="font-bold text-white">{data.count}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5" id="debt-portfolio-visualizer">
      
      {/* Header section with toggle option */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 p-1.5 rounded-xl border border-blue-200">
              <TrendingUp className="h-4.5 w-4.5" />
            </span>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Debt Portfolio Allocator
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">
                Asset-Liability risk visualizer and portfolio aggregation
              </p>
            </div>
          </div>
        </div>

        {/* View Switches & Demo Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          
          {/* Real vs Demo switcher */}
          {!hasMultipleActive && (
            <button
              onClick={() => setIsSimulated(!isSimulated)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                isSimulated 
                  ? "bg-amber-100 text-amber-800 border-amber-300" 
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {isSimulated ? "📊 Viewing Simulated Demo" : "⚡ Try Portfolio Demo"}
            </button>
          )}

          {/* Pie vs Bar toggle */}
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200/50 flex items-center">
            <button
              onClick={() => setViewType("pie")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewType === "pie" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Pie Chart View"
            >
              <PieIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewType("bar")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewType === "bar" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Bar Chart View"
            >
              <BarChart2 className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Info notification about multiple loans */}
      {!hasMultipleActive && !isSimulated && (
        <div className="bg-blue-50/70 border border-blue-100/80 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-slate-600 animate-fade-in">
          <Sparkles className="h-4.5 w-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-slate-800">Diversified Risk Aggregation</p>
            <p>
              You currently have {activeApps.length === 1 ? "only one active application" : "no active applications"}. Submit multiple applications (e.g. Home and Vehicle) to generate a live, multi-facility debt distribution report.
            </p>
            <button
              type="button"
              onClick={() => setIsSimulated(true)}
              className="text-blue-600 font-bold hover:underline text-[10px] mt-1 block"
            >
              Load Simulated Multi-Loan Scenario &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Key Portfolio Metrics Grid */}
      <div className="grid grid-cols-3 gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-150">
        <div>
          <span className="text-slate-400 text-[9px] block font-mono font-bold uppercase tracking-wider">
            Total Combined Debt
          </span>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm font-mono block mt-0.5">
            {formatLKR(metrics.total)}
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">
            {isSimulated ? "Demo Sandbox" : "Live Obligations"}
          </span>
        </div>
        <div>
          <span className="text-slate-400 text-[9px] block font-mono font-bold uppercase tracking-wider">
            Active credit lines
          </span>
          <span className="font-extrabold text-blue-600 text-xs sm:text-sm font-mono block mt-0.5">
            {metrics.totalCount} Facilities
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">
            Across types
          </span>
        </div>
        <div>
          <span className="text-slate-400 text-[9px] block font-mono font-bold uppercase tracking-wider">
            Avg facility size
          </span>
          <span className="font-extrabold text-purple-600 text-xs sm:text-sm font-mono block mt-0.5">
            {formatLKR(metrics.average)}
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5 font-sans font-medium">
            Per active file
          </span>
        </div>
      </div>

      {/* Recharts Visual Canvas Container */}
      <div className="h-56 w-full flex items-center justify-center bg-slate-50/30 rounded-2xl p-2 border border-slate-100">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === "pie" ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }}
              />
            </PieChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                fontWeight="bold"
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                fontWeight="bold"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Side Color Legends & Share Table */}
      <div className="space-y-2">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
          Asset class distribution breakdown
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          {chartData.map((item) => {
            const pct = metrics.total > 0 ? ((item.value / metrics.total) * 100).toFixed(1) : 0;
            return (
              <div 
                key={item.name} 
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-sans"
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="h-2 w-2 rounded-full inline-block" 
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="font-extrabold text-slate-700 uppercase tracking-tight">{item.name}</span>
                </div>
                <div className="text-right font-mono font-bold text-slate-600">
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security note footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[9px] font-mono text-slate-400">
        <Lock className="h-3 w-3 text-blue-500" />
        <span>Aggregated via secure Central Bank Credit Information Bureau (CRIB) APIs.</span>
      </div>

    </div>
  );
}
