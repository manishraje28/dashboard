import { 
  LayoutDashboard, 
  ShoppingCart, 
  Sparkles, 
  BarChart3, 
  Settings as SettingsIcon,
  CircleDot,
  ArrowUpRight,
  Database
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, cartsCount = 0 }) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "carts", label: "Abandoned Carts", icon: ShoppingCart, count: cartsCount },
    { id: "campaigns", label: "AI Campaigns", icon: Sparkles },
    { id: "analytics", label: "Advanced Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <aside className="w-68 min-h-screen glass-panel border-r border-zinc-800/80 flex flex-col p-6 sticky top-0 h-screen shrink-0 z-20">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-10 mt-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-pulse-glow">
          <Sparkles className="h-5.5 w-5.5 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
            Recover<span className="text-cyan-400">AI</span>
          </span>
          <span className="text-[10px] block text-zinc-500 font-mono">v2.1 Autonomous</span>
        </div>
      </div>

      {/* Database/System Status Indicator */}
      <div className="mb-8 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-400" />
          <span className="text-xs text-zinc-400 font-medium">Supabase Core</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider font-semibold">Live</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? "text-white font-medium bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border-l-3 border-cyan-400"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.02] border-l-3 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-cyan-400" : "text-zinc-400 group-hover:text-white"
                }`} />
                <span className="text-sm">{item.label}</span>
              </div>
              {item.count && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isActive 
                    ? "bg-cyan-500/20 text-cyan-300" 
                    : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer - User Profile */}
      <div className="mt-auto border-t border-white/[0.06] pt-5">
        <div className="flex items-center gap-3 p-1">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="Client Avatar" 
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-cyan-500/20"
            />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#030712] flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white truncate">Acme E-commerce</h4>
            <p className="text-[10px] text-zinc-500 truncate">acme@recovery.ai</p>
          </div>
          <button className="h-7 w-7 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}