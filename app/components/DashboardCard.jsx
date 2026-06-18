import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  progress,
  icon: Icon,
  trend,
  color = "cyan",
  description
}) {
  // Determine color theme classes
  const colors = {
    cyan: {
      border: "hover:border-cyan-500/30",
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      stroke: "stroke-cyan-400",
      glow: "shadow-cyan-500/5",
    },
    purple: {
      border: "hover:border-purple-500/30",
      text: "text-purple-400",
      bg: "bg-purple-500/10",
      stroke: "stroke-purple-400",
      glow: "shadow-purple-500/5",
    },
    emerald: {
      border: "hover:border-emerald-500/30",
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      stroke: "stroke-emerald-400",
      glow: "shadow-emerald-500/5",
    },
    amber: {
      border: "hover:border-amber-500/30",
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      stroke: "stroke-amber-400",
      glow: "shadow-amber-500/5",
    },
  }[color] || colors.cyan;

  // Calculate circular progress parameters
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(Math.max(progress, 0), 100) / 100) * circumference;

  return (
    <div className={`glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-lg ${colors.glow} ${colors.border}`}>
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        {/* Icon & Title */}
        <div className="flex flex-col">
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1.5">{title}</span>
          <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-50 transition-colors">
            {value}
          </h3>
        </div>

        {/* Circular Progress Ring or Icon wrapper */}
        {progress !== undefined ? (
          <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-zinc-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="24"
                cy="24"
              />
              <circle
                className={`${colors.stroke} transition-all duration-1000 ease-out`}
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="24"
                cy="24"
              />
            </svg>
            <span className="absolute text-[10px] font-bold font-mono text-white">
              {Math.round(progress)}%
            </span>
          </div>
        ) : Icon ? (
          <div className={`h-11 w-11 rounded-xl ${colors.bg} flex items-center justify-center border border-white/[0.04] shrink-0`}>
            <Icon className={`h-5 w-5 ${colors.text}`} />
          </div>
        ) : null}
      </div>

      {/* Bottom Section - Trend & Info */}
      <div className="mt-2 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs">
        {trend ? (
          <span className={`flex items-center gap-1 font-semibold ${trend.positive ? "text-emerald-400" : "text-rose-400"}`}>
            {trend.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            <span>{trend.value}%</span>
            <span className="text-zinc-500 font-normal ml-0.5">{trend.label || "vs last week"}</span>
          </span>
        ) : (
          <span className="text-zinc-500">{description || "Autonomous metric"}</span>
        )}
      </div>

      {/* Subtle Background Glow Accent on Hover */}
      <div className={`absolute -right-12 -bottom-12 w-24 h-24 rounded-full ${colors.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
    </div>
  );
}