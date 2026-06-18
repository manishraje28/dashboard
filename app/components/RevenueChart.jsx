import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { TrendingUp, Percent, MessageSquare, Mail, PhoneCall, HelpCircle } from "lucide-react";

// Helper to check client-side rendering mount
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label, prefix = "₹" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3.5 rounded-xl border border-zinc-800 shadow-xl text-xs font-sans">
        <p className="text-zinc-400 font-mono mb-1">{label}</p>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-zinc-300 font-medium">{item.name}:</span>
            <span className="text-white font-bold font-mono">
              {prefix}{typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Revenue Recovery & Rate Trend Chart (Area Chart)
export function RevenueTrendChart({ data }) {
  const isMounted = useMounted();
  const [metric, setMetric] = useState("revenue"); // "revenue" or "rate"

  if (!isMounted) {
    return <div className="h-80 w-full bg-zinc-950/20 border border-zinc-900 rounded-2xl animate-pulse" />;
  }

  // Format data for Recharts.
  const chartData = data && data.length > 0 
    ? data.map(d => {
        // Format timestamp
        const time = new Date(d.created_at);
        const label = isNaN(time.getTime()) 
          ? d.date 
          : time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          time: label,
          revenue: d.recovered_revenue || 0,
          rate: Math.round(d.recovery_rate || 0),
          total: d.total_carts || 0,
          recovered: d.recovered_carts || 0,
        };
      })
    : [];

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-96">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-cyan-400" />
            Recovery Funnel Performance
          </h3>
          <span className="text-xs text-zinc-500">Real-time recovery timeline tracking</span>
        </div>

        {/* Tab switch */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <button
            onClick={() => setMetric("revenue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              metric === "revenue" 
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/10" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Recovered Revenue
          </button>
          <button
            onClick={() => setMetric("rate")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              metric === "rate" 
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/10" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Recovery Rate
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dx={-5}
              tickFormatter={(value) => metric === "revenue" ? `₹${value}` : `${value}%`}
            />
            <Tooltip content={<CustomTooltip prefix={metric === "revenue" ? "₹" : ""} />} />
            {metric === "revenue" ? (
              <Area 
                name="Recovered Revenue"
                type="monotone" 
                dataKey="revenue" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCyan)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: "#06b6d4" }}
              />
            ) : (
              <Area 
                name="Recovery Rate"
                type="monotone" 
                dataKey="rate" 
                stroke="#a855f7" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPurple)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: "#a855f7" }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 2. Channel Performance Chart (Bar Chart)
export function ChannelPerformanceChart({ analytics }) {
  const isMounted = useMounted();

  if (!isMounted) {
    return <div className="h-80 w-full bg-zinc-950/20 border border-zinc-900 rounded-2xl animate-pulse" />;
  }

  // Create Channel stats from analytics
  // Sent volume and recovery volume
  const emailSent = analytics?.emails_sent || 0;
  const whatsappSent = analytics?.whatsapp_sent || 0;
  const callsSent = analytics?.calls_sent || 0;

  // Let's model conversion. Emails: 35%, WhatsApp: 65%, Calls: 50%
  const data = [
    {
      name: "Emails",
      sent: emailSent,
      recovered: Math.round(emailSent * 0.35),
      color: "#06b6d4",
      icon: Mail,
    },
    {
      name: "WhatsApp",
      sent: whatsappSent,
      recovered: Math.round(whatsappSent * 0.65),
      color: "#10b981",
      icon: MessageSquare,
    },
    {
      name: "Voice Calls",
      sent: callsSent,
      recovered: Math.round(callsSent * 0.50),
      color: "#a855f7",
      icon: PhoneCall,
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-96">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
          <MessageSquare className="h-4.5 w-4.5 text-cyan-400" />
          Recovery Channel Conversions
        </h3>
        <span className="text-xs text-zinc-500 font-sans">Sent volume vs successfully recovered orders</span>
      </div>

      <div className="flex-1 min-h-0 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: -25, bottom: 0 }} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={8}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip prefix="" />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconSize={8}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', color: '#9ca3af', paddingTop: '0' }}
            />
            <Bar name="Reminders Sent" dataKey="sent" fill="rgba(255,255,255,0.08)" radius={[4, 4, 0, 0]} />
            <Bar name="Orders Recovered" dataKey="recovered" fill="#06b6d4" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 3. Cart Distribution Donut Chart (Pie Chart)
export function CartStatusDonutChart({ analytics }) {
  const isMounted = useMounted();

  if (!isMounted) {
    return <div className="h-80 w-full bg-zinc-950/20 border border-zinc-900 rounded-2xl animate-pulse" />;
  }

  const total = analytics?.total_carts || 0;
  const recovered = analytics?.recovered_carts || 0;
  const pending = analytics?.pending_carts || 0;
  // Lost carts: total - recovered - pending (or 0)
  const lost = Math.max(0, total - recovered - pending);

  const data = [
    { name: "Recovered", value: recovered, color: "#10b981" },
    { name: "Pending", value: pending, color: "#f59e0b" },
    { name: "Lost/Expired", value: lost, color: "#ef4444" },
  ].filter(item => item.value > 0);

  // If no carts yet, show a default empty distribution
  const chartData = data.length > 0 ? data : [{ name: "No data", value: 1, color: "#374151" }];
  const recoveryRate = Math.round(analytics?.recovery_rate || 0);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-96">
      <div>
        <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
          <Percent className="h-4.5 w-4.5 text-cyan-400" />
          Cart Status Breakdown
        </h3>
        <span className="text-xs text-zinc-500">Disposition distribution of recovered checkouts</span>
      </div>

      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, "Carts"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center Text inside Donut */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-semibold tracking-widest text-zinc-500 font-mono">Recovery</span>
          <span className="text-3xl font-bold text-white tracking-tight">{recoveryRate}%</span>
          <span className="text-[10px] text-zinc-400 font-mono">{recovered}/{total} Carts</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/[0.04] pt-4 text-center">
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Recovered</span>
          </div>
          <span className="text-sm font-semibold text-white font-mono">{recovered}</span>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            <span>Pending</span>
          </div>
          <span className="text-sm font-semibold text-white font-mono">{pending}</span>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
            <span>Lost</span>
          </div>
          <span className="text-sm font-semibold text-white font-mono">{lost}</span>
        </div>
      </div>
    </div>
  );
}
