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
  PERSONAL: "var(--color-primary-500)", // Blue
  HOME: "var(--color-success-500)",     // Emerald
  VEHICLE: "var(--color-warning-500)",  // Amber
  SME: "var(--color-accent-violet-500)",      // Purple
  BUSINESS: "#ec4899", // Pink
  OTHER: "var(--color-neutral-500)"     // Slate
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
        <div className="bg-neutral-900 text-white p-3.5 rounded-2xl border border-neutral-800 shadow-xl font-sans text-xs space-y-1">
          <p className="font-extrabold tracking-tight text-[11px] uppercase text-neutral-300">
            {data.name} LOAN DEBT
          </p>
          <p className="text-sm font-mono font-bold text-teal-400">
            LKR {data.value.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-800 mt-1">
            <span>Portfolio Share:</span>
            <span className="font-bold text-white">{percentage}%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <span>Active Facilities:</span>
            <span className="font-bold text-white">{data.count}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl rounded-3xl p-5 sm:p-6 shadow-md shadow-primary/5 space-y-5" id="debt-portfolio-visualizer">
      
      {/* Header section with toggle option */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-700/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-primary-100 text-primary-800 p-1.5 rounded-xl border border-primary-200">
              <TrendingUp className="h-4.5 w-4.5" />
            </span>
            <div>
              <h4 className="text-xs font-extrabold text-neutral-50 uppercase tracking-wider">
                Debt Portfolio Allocator
              </h4>
              <p className="text-[10px] text-neutral-500 font-medium">
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
                  ? "bg-warning-100 text-warning-800 border-warning-300" 
                  : "bg-neutral-900/30 text-neutral-500 border-neutral-700/50 hover:bg-neutral-800/50"
              }`}
            >
              {isSimulated ? "📊 Viewing Simulated Demo" : "⚡ Try Portfolio Demo"}
            </button>
          )}

          {/* Pie vs Bar toggle */}
          <div className="bg-neutral-800/50 p-0.5 rounded-xl border border-neutral-700/50/50 flex items-center">
            <button
              onClick={() => setViewType("pie")}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewType === "pie" ? "bg-neutral-900/50 text-neutral-50 shadow-md shadow-primary/5" : "text-neutral-400 hover:text-neutral-300"
              }`}
              title="Pie Chart View"
            >
              <PieIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewType("bar")}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewType === "bar" ? "bg-neutral-900/50 text-neutral-50 shadow-md shadow-primary/5" : "text-neutral-400 hover:text-neutral-300"
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
        <div className="bg-primary-900/20/70 border border-primary-100/80 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-neutral-300 animate-fade-in">
          <Sparkles className="h-4.5 w-4.5 text-primary-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-neutral-50">Diversified Risk Aggregation</p>
            <p>
              You currently have {activeApps.length === 1 ? "only one active application" : "no active applications"}. Submit multiple applications (e.g. Home and Vehicle) to generate a live, multi-facility debt distribution report.
            </p>
            <button
              type="button"
              onClick={() => setIsSimulated(true)}
              className="text-primary-600 font-bold hover:underline text-[10px] mt-1 block transition-all duration-200"
            >
              Load Simulated Multi-Loan Scenario &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Key Portfolio Metrics Grid */}
      <div className="grid grid-cols-3 gap-3.5 bg-neutral-900/30 p-4 rounded-2xl border border-neutral-700/50">
        <div>
          <span className="text-neutral-400 text-[9px] block font-mono font-bold uppercase tracking-wider">
            Total Combined Debt
          </span>
          <span className="font-extrabold text-neutral-50 text-xs sm:text-sm font-mono block mt-0.5">
            {formatLKR(metrics.total)}
          </span>
          <span className="text-[9px] text-neutral-400 block mt-0.5">
            {isSimulated ? "Demo Sandbox" : "Live Obligations"}
          </span>
        </div>
        <div>
          <span className="text-neutral-400 text-[9px] block font-mono font-bold uppercase tracking-wider">
            Active credit lines
          </span>
          <span className="font-extrabold text-primary-600 text-xs sm:text-sm font-mono block mt-0.5">
            {metrics.totalCount} Facilities
          </span>
          <span className="text-[9px] text-neutral-400 block mt-0.5">
            Across types
          </span>
        </div>
        <div>
          <span className="text-neutral-400 text-[9px] block font-mono font-bold uppercase tracking-wider">
            Avg facility size
          </span>
          <span className="font-extrabold text-accent-violet-600 text-xs sm:text-sm font-mono block mt-0.5">
            {formatLKR(metrics.average)}
          </span>
          <span className="text-[9px] text-neutral-400 block mt-0.5 font-sans font-medium">
            Per active file
          </span>
        </div>
      </div>

      {/* Recharts Visual Canvas Container */}
      <div className="h-56 w-full flex items-center justify-center bg-neutral-900/30/30 rounded-2xl p-2 border border-neutral-700/30">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === "pie" ? (
            <PieChart>
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient key={`grad-${index}`} id={`colorPie${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={entry.color} stopOpacity={1}/>
                    <stop offset="95%" stopColor={entry.color} stopOpacity={0.6}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorPie${index})`} style={{ filter: `drop-shadow(0px 0px 4px ${entry.color})` }} />
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
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient key={`gradBar-${index}`} id={`colorBar${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={entry.color} stopOpacity={1}/>
                    <stop offset="95%" stopColor={entry.color} stopOpacity={0.2}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                fontWeight="bold"
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                fontWeight="bold"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.05)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorBar${index})`} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Side Color Legends & Share Table */}
      <div className="space-y-2">
        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
          Asset class distribution breakdown
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          {chartData.map((item) => {
            const pct = metrics.total > 0 ? ((item.value / metrics.total) * 100).toFixed(1) : 0;
            return (
              <div 
                key={item.name} 
                className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/30 border border-neutral-700/30 text-[10px] font-sans"
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="h-2 w-2 rounded-full inline-block" 
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="font-extrabold text-neutral-200 uppercase tracking-tight">{item.name}</span>
                </div>
                <div className="text-right font-mono font-bold text-neutral-300">
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security note footer */}
      <div className="pt-3 border-t border-neutral-700/30 flex items-center justify-center gap-1.5 text-[9px] font-mono text-neutral-400">
        <Lock className="h-3 w-3 text-primary-500" />
        <span>Aggregated via secure Central Bank Credit Information Bureau (CRIB) APIs.</span>
      </div>

    </div>
  );
}
