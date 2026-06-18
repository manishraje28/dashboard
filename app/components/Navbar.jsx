import { useState } from "react";
import { 
  Bell, 
  Search, 
  Calendar, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function Navbar({ activeTab, dateRange, setDateRange, onRefresh, isRefreshing }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Cart recovered! ₹4,800 recovered from user Rohit S.", type: "success", time: "2m ago" },
    { id: 2, text: "Automated WhatsApp sequence sent to Priya M.", type: "info", time: "15m ago" },
    { id: 3, text: "AI Voice Agent call scheduled for cart #9302", type: "warning", time: "1h ago" },
  ]);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case "overview": return "Overview Dashboard";
      case "carts": return "Abandoned Carts Monitor";
      case "campaigns": return "AI Recovery Campaigns";
      case "analytics": return "Advanced Analytical Insights";
      case "settings": return "System Settings";
      default: return "Dashboard";
    }
  };

  return (
    <header className="h-20 glass-panel border-b border-zinc-800/80 px-8 flex items-center justify-between sticky top-0 z-30 bg-zinc-950/70 backdrop-blur-md">
      {/* Breadcrumbs / Title */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <span>Console</span>
          <span>/</span>
          <span className="text-zinc-400 capitalize">{activeTab}</span>
        </div>
        <h1 className="text-lg font-semibold text-white tracking-wide mt-0.5">
          {getBreadcrumb()}
        </h1>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 max-md:hidden">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search transactions, clients..." 
            className="w-full h-10 pl-10 pr-4 rounded-xl text-sm glass-input placeholder-zinc-500 text-white"
          />
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 h-10 hover:bg-white/[0.04] transition-colors">
          <Calendar className="h-4 w-4 text-cyan-400" />
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="today" className="bg-zinc-900 text-white">Today</option>
            <option value="7days" className="bg-zinc-900 text-white">Last 7 Days</option>
            <option value="30days" className="bg-zinc-900 text-white">Last 30 Days</option>
            <option value="all" className="bg-zinc-900 text-white">All Time</option>
          </select>
        </div>

        {/* Sync/Refresh Button */}
        <button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`h-10 w-10 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] text-zinc-400 hover:text-white flex items-center justify-center transition-all disabled:opacity-50 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`}
          title="Sync Realtime Data"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`h-10 w-10 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] text-zinc-400 hover:text-white flex items-center justify-center transition-all relative ${showNotifications ? 'bg-white/[0.08] text-white border-cyan-500/50' : ''}`}
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-zinc-950"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel border border-zinc-800 rounded-xl p-4 shadow-xl z-50 animate-fade-in">
              <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2">
                <span className="text-xs font-semibold text-white">System Notifications</span>
                <button 
                  onClick={() => setNotifications([])}
                  className="text-[10px] text-cyan-400 hover:underline"
                >
                  Clear all
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">No new notifications</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex gap-2.5 items-start p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                      {notif.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-300 leading-normal break-words">{notif.text}</p>
                        <span className="text-[9px] text-zinc-500 font-mono mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}