"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "./components/SideBar";
import Navbar from "./components/Navbar";
import DashboardCard from "./components/DashboardCard";
import {
  RevenueTrendChart,
  ChannelPerformanceChart,
  CartStatusDonutChart
} from "./components/RevenueChart";
import {
  DollarSign,
  ShoppingCart,
  CheckCircle,
  HelpCircle,
  Mail,
  MessageSquare,
  PhoneCall,
  Percent,
  Search,
  ChevronRight,
  Sparkles,
  Download,
  AlertTriangle,
  Play,
  Settings as SettingsIcon,
  X,
  Volume2,
  Lock,
  Globe,
  Database
} from "lucide-react";

// Mock Fallback Data for full interactive experience
const MOCK_LATEST_ANALYTICS = {
  total_carts: 18,
  pending_carts: 8,
  recovered_carts: 10,
  emails_sent: 14,
  whatsapp_sent: 11,
  calls_sent: 6,
  recovered_revenue: 124950,
  recovery_rate: 55.5,
  date: "2026-06-18"
};

const MOCK_HISTORICAL_DATA = [
  { created_at: "2026-06-18T09:00:00", recovered_revenue: 28000, recovery_rate: 25.0, total_carts: 4, pending_carts: 3, recovered_carts: 1, emails_sent: 2, whatsapp_sent: 1, calls_sent: 0 },
  { created_at: "2026-06-18T10:00:00", recovered_revenue: 45000, recovery_rate: 33.3, total_carts: 6, pending_carts: 4, recovered_carts: 2, emails_sent: 4, whatsapp_sent: 2, calls_sent: 1 },
  { created_at: "2026-06-18T11:00:00", recovered_revenue: 62000, recovery_rate: 42.8, total_carts: 7, pending_carts: 4, recovered_carts: 3, emails_sent: 6, whatsapp_sent: 3, calls_sent: 2 },
  { created_at: "2026-06-18T12:00:00", recovered_revenue: 85500, recovery_rate: 45.4, total_carts: 11, pending_carts: 6, recovered_carts: 5, emails_sent: 8, whatsapp_sent: 5, calls_sent: 3 },
  { created_at: "2026-06-18T13:00:00", recovered_revenue: 98000, recovery_rate: 50.0, total_carts: 12, pending_carts: 6, recovered_carts: 6, emails_sent: 9, whatsapp_sent: 7, calls_sent: 4 },
  { created_at: "2026-06-18T14:00:00", recovered_revenue: 104500, recovery_rate: 46.1, total_carts: 13, pending_carts: 7, recovered_carts: 6, emails_sent: 11, whatsapp_sent: 8, calls_sent: 5 },
  { created_at: "2026-06-18T15:00:00", recovered_revenue: 124950, recovery_rate: 55.5, total_carts: 18, pending_carts: 8, recovered_carts: 10, emails_sent: 14, whatsapp_sent: 11, calls_sent: 6 }
];

const MOCK_ABANDONED_CARTS = [
  { id: "cart_101", name: "Siddharth Sharma", email: "siddharth@example.com", value: 18500, items: [{ name: "Mechanical Keyboard Pro", qty: 1, price: 12500 }, { name: "Ergonomic Office Mouse", qty: 1, price: 6000 }], date: "2026-06-18 15:12", status: "Recovered", channel: "WhatsApp", timeline: [{ time: "15:12", text: "Cart Abandoned" }, { time: "15:22", text: "Automated WhatsApp sequence sent" }, { time: "15:28", text: "Client clicked checkout link" }, { time: "15:30", text: "Order Recovered - Paid ₹18,500" }] },
  { id: "cart_102", name: "Ananya Iyer", email: "ananya@example.com", value: 8900, items: [{ name: "Leather Sling Handbag", qty: 1, price: 8900 }], date: "2026-06-18 14:45", status: "Pending", channel: "Email", timeline: [{ time: "14:45", text: "Cart Abandoned" }, { time: "15:00", text: "Email Sequence Stage 1 sent" }] },
  { id: "cart_103", name: "Kabir Mehta", email: "kabir@mehta.com", value: 64500, items: [{ name: "Studio Monitor Speakers (Pair)", qty: 1, price: 42000 }, { name: "USB-C Audio Interface", qty: 1, price: 22500 }], date: "2026-06-18 13:20", status: "Recovered", channel: "Call", timeline: [{ time: "13:20", text: "Cart Abandoned" }, { time: "13:35", text: "Email reminder sent" }, { time: "14:00", text: "AI Voice Call Agent completed" }, { time: "14:05", text: "Order Recovered with 10% phone discount" }] },
  { id: "cart_104", name: "Priya Nair", email: "priya.nair@example.com", value: 4200, items: [{ name: "Aromatherapy Diffuser", qty: 1, price: 2400 }, { name: "Lavender Essential Oil", qty: 2, price: 900 }], date: "2026-06-18 12:05", status: "Pending", channel: "WhatsApp", timeline: [{ time: "12:05", text: "Cart Abandoned" }, { time: "12:15", text: "WhatsApp Reminder Sent" }, { time: "12:45", text: "WhatsApp Link Clicked" }] },
  { id: "cart_105", name: "Rahul Verma", email: "rahul.v@domain.com", value: 29900, items: [{ name: "Noise Cancelling Headphones", qty: 1, price: 29900 }], date: "2026-06-18 10:10", status: "Lost", channel: "Email", timeline: [{ time: "10:10", text: "Cart Abandoned" }, { time: "10:25", text: "Email Sequence Stage 1 sent" }, { time: "14:25", text: "Email Sequence Stage 2 sent (10% Discount)" }, { time: "22:00", text: "Session Expired - No Purchase" }] },
  { id: "cart_106", name: "Meera Deshmukh", email: "meera.d@example.com", value: 5500, items: [{ name: "Designer Ceramic Vase", qty: 1, price: 5500 }], date: "2026-06-18 09:30", status: "Recovered", channel: "Email", timeline: [{ time: "09:30", text: "Cart Abandoned" }, { time: "09:45", text: "Email Sequence Stage 1 sent" }, { time: "09:52", text: "Order Recovered - Paid ₹5,500" }] }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("today");
  const [analytics, setAnalytics] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>(MOCK_ABANDONED_CARTS);
  const [selectedCart, setSelectedCart] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartFilter, setCartFilter] = useState("All");

  // AI Agent Settings State
  const [discountCode, setDiscountCode] = useState("SAVE15");
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [aiVoiceGender, setAiVoiceGender] = useState("female");
  const [aiVoiceTone, setAiVoiceTone] = useState("empathetic");
  const [isAiCallEnabled, setIsAiCallEnabled] = useState(true);
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(true);
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);

  // Status Alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info">("success");

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch latest snapshot
      const { data: latestData, error: latestError } = await supabase
        .from("analytics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      // 2. Fetch history for the charts
      const { data: histData, error: histError } = await supabase
        .from("analytics")
        .select("*")
        .order("created_at", { ascending: true });

      if (latestError || !latestData || latestData.length === 0) {
        // Fallback to mock data if DB empty or error
        console.warn("Using fallback mock data due to Supabase access/empty state:", latestError);
        setAnalytics(MOCK_LATEST_ANALYTICS);
        setHistoricalData(MOCK_HISTORICAL_DATA);
      } else {
        setAnalytics(latestData[0]);
        setHistoricalData(histData || []);
      }
    } catch (e) {
      console.error("Database connection error:", e);
      setAnalytics(MOCK_LATEST_ANALYTICS);
      setHistoricalData(MOCK_HISTORICAL_DATA);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handleManualAction = (cartId: string, actionType: string) => {
    showToast(`Initiating manual ${actionType} recovery for Cart #${cartId}...`, "info");
    
    // Simulate recovery update after 2 seconds
    setTimeout(() => {
      setAbandonedCarts(prev => prev.map(cart => {
        if (cart.id === cartId) {
          const newTimeline = [
            ...cart.timeline,
            { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: `Manual ${actionType} triggered by Admin` }
          ];

          // If discount, let's also recover it for interactive fun!
          const shouldRecover = actionType.includes("Discount") || actionType.includes("Call");
          const updatedStatus = shouldRecover ? "Recovered" : cart.status;
          
          if (shouldRecover) {
            newTimeline.push({
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: `Order Recovered via manual code! Paid ₹${cart.value.toLocaleString()}`
            });
            showToast(`Success! Cart #${cartId} recovered successfully!`, "success");

            // Update KPI locally
            setAnalytics((prev: any) => ({
              ...prev,
              recovered_carts: prev.recovered_carts + 1,
              pending_carts: Math.max(0, prev.pending_carts - 1),
              recovered_revenue: prev.recovered_revenue + cart.value,
              recovery_rate: Math.round(((prev.recovered_carts + 1) / prev.total_carts) * 100)
            }));
          }

          const updatedCart = {
            ...cart,
            status: updatedStatus,
            channel: actionType.includes("WhatsApp") ? "WhatsApp" : actionType.includes("Call") ? "Call" : "Email",
            timeline: newTimeline
          };

          // If currently open in drawer, update the drawer detail too
          if (selectedCart && selectedCart.id === cartId) {
            setSelectedCart(updatedCart);
          }

          return updatedCart;
        }
        return cart;
      }));
    }, 1500);
  };

  // Export Analytics CSV
  const handleExportData = () => {
    showToast("Generating CSV report...", "info");
    
    const headers = ["Date/Time", "Total Carts", "Pending Carts", "Recovered Carts", "Recovered Revenue (INR)", "Recovery Rate (%)", "Emails Sent", "WhatsApp Sent", "Calls Sent"];
    const rows = historicalData.map(d => [
      new Date(d.created_at).toLocaleString(),
      d.total_carts,
      d.pending_carts,
      d.recovered_carts,
      d.recovered_revenue,
      Math.round(d.recovery_rate),
      d.emails_sent,
      d.whatsapp_sent,
      d.calls_sent
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RecoverAI_Report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Report exported successfully!", "success");
  };

  // Filtered abandoned carts list
  const filteredCarts = abandonedCarts.filter(cart => {
    const matchesSearch = cart.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cart.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cart.id.includes(searchQuery);
    
    if (cartFilter === "All") return matchesSearch;
    return matchesSearch && cart.status.toLowerCase() === cartFilter.toLowerCase();
  });

  const cards = [
    {
      title: "Revenue Recovered",
      value: `₹${(analytics?.recovered_revenue ?? 0).toLocaleString()}`,
      progress: Math.round(analytics?.recovery_rate ?? 0),
      color: "emerald",
      trend: { value: 18.2, positive: true, label: "vs yesterday" }
    },
    {
      title: "Active Recovery Rate",
      value: `${Math.round(analytics?.recovery_rate ?? 0)}%`,
      progress: Math.round(analytics?.recovery_rate ?? 0),
      color: "cyan",
      trend: { value: 4.5, positive: true, label: "vs last week" }
    },
    {
      title: "Total Carts",
      value: analytics?.total_carts ?? 0,
      icon: ShoppingCart,
      color: "purple",
      trend: { value: 12.0, positive: true, label: "volume growth" }
    },
    {
      title: "Recovered Carts",
      value: analytics?.recovered_carts ?? 0,
      progress: Math.round(((analytics?.recovered_carts ?? 0) / (analytics?.total_carts ?? 1)) * 100),
      color: "emerald",
      description: `${analytics?.pending_carts ?? 0} checkouts remaining`
    },
    {
      title: "AI Emails Sent",
      value: analytics?.emails_sent ?? 0,
      icon: Mail,
      color: "cyan",
      description: "94% deliverability score"
    },
    {
      title: "WhatsApp Reminders",
      value: analytics?.whatsapp_sent ?? 0,
      icon: MessageSquare,
      color: "emerald",
      description: "68% click-through rate"
    },
    {
      title: "AI Voice Calls",
      value: analytics?.calls_sent ?? 0,
      icon: PhoneCall,
      color: "purple",
      description: "Avg call duration 1m 24s"
    },
    {
      title: "Carts Pending",
      value: analytics?.pending_carts ?? 0,
      progress: Math.round(((analytics?.pending_carts ?? 0) / (analytics?.total_carts ?? 1)) * 100),
      color: "amber",
      description: "Awaiting automated triggers"
    }
  ];

  // RENDER: Overview Dashboard
  const renderOverview = () => (
    <div className="space-y-8 animate-slide-up">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            progress={card.progress}
            icon={card.icon}
            trend={card.trend}
            color={card.color}
            description={card.description}
          />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueTrendChart data={historicalData} />
        </div>
        <div>
          <CartStatusDonutChart analytics={analytics} />
        </div>
      </div>

      {/* Channel Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <ChannelPerformanceChart analytics={analytics} />
        </div>

        {/* Recent Abandoned Carts Table (Quick View) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[384px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">Recent Abandoned Checkouts</h3>
                <p className="text-xs text-zinc-500">Real-time purchase intent streams</p>
              </div>
              <button 
                onClick={() => setActiveTab("carts")}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
              >
                View all Carts 
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs text-zinc-400 border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.04] text-zinc-500 uppercase tracking-wider font-mono">
                    <th className="py-3 px-2">Cart ID</th>
                    <th className="py-3 px-2">Client</th>
                    <th className="py-3 px-2">Value</th>
                    <th className="py-3 px-2">Active Channel</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Drill down</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {abandonedCarts.slice(0, 4).map((cart) => (
                    <tr 
                      key={cart.id} 
                      onClick={() => setSelectedCart(cart)}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-2 font-mono text-zinc-300">#{cart.id}</td>
                      <td className="py-3.5 px-2">
                        <div className="font-semibold text-white">{cart.name}</div>
                        <div className="text-[10px] text-zinc-500">{cart.email}</div>
                      </td>
                      <td className="py-3.5 px-2 font-semibold text-white font-mono">₹{cart.value.toLocaleString()}</td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          cart.channel === "WhatsApp" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          cart.channel === "Call" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                          "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        }`}>
                          {cart.channel}
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`h-2.5 w-2.5 rounded-full inline-block mr-1.5 ${
                          cart.status === "Recovered" ? "bg-emerald-500 animate-pulse" :
                          cart.status === "Pending" ? "bg-amber-500" :
                          "bg-rose-500"
                        }`} />
                        <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                          cart.status === "Recovered" ? "text-emerald-400" :
                          cart.status === "Pending" ? "text-amber-400" :
                          "text-rose-400"
                        }`}>
                          {cart.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button className="text-zinc-500 group-hover:text-cyan-400 transition-colors">
                          <ChevronRight className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // RENDER: Carts Tab View
  const renderCarts = () => (
    <div className="space-y-6 animate-slide-up">
      {/* Search & Filters */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search cart ID, client name, or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl text-sm glass-input placeholder-zinc-500 text-white"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] shrink-0 self-start md:self-auto">
          {["All", "Recovered", "Pending", "Lost"].map((filter) => (
            <button
              key={filter}
              onClick={() => setCartFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                cartFilter === filter 
                  ? "bg-cyan-500 text-white shadow-lg" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-zinc-400 border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] text-zinc-500 uppercase tracking-wider font-mono text-xs">
                <th className="py-4 px-6">Cart ID</th>
                <th className="py-4 px-6">Client Details</th>
                <th className="py-4 px-6">Cart Value</th>
                <th className="py-4 px-6">Items Included</th>
                <th className="py-4 px-6">Date Abandoned</th>
                <th className="py-4 px-6">Active Channel</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Drill down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredCarts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    No abandoned carts found matching filters.
                  </td>
                </tr>
              ) : (
                filteredCarts.map((cart) => (
                  <tr 
                    key={cart.id} 
                    onClick={() => setSelectedCart(cart)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="py-4.5 px-6 font-mono text-zinc-300">#{cart.id}</td>
                    <td className="py-4.5 px-6">
                      <div className="font-semibold text-white">{cart.name}</div>
                      <div className="text-xs text-zinc-500">{cart.email}</div>
                    </td>
                    <td className="py-4.5 px-6 font-semibold text-white font-mono text-base">₹{cart.value.toLocaleString()}</td>
                    <td className="py-4.5 px-6">
                      <span className="text-xs text-zinc-300 truncate max-w-[200px] block">
                        {cart.items.map((it: any) => `${it.qty}x ${it.name}`).join(", ")}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-zinc-400 text-xs font-mono">{cart.date}</td>
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        cart.channel === "WhatsApp" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        cart.channel === "Call" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                        "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      }`}>
                        {cart.channel}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full inline-block ${
                          cart.status === "Recovered" ? "bg-emerald-500 animate-pulse" :
                          cart.status === "Pending" ? "bg-amber-500" :
                          "bg-rose-500"
                        }`} />
                        <span className={`text-xs uppercase tracking-wider font-bold ${
                          cart.status === "Recovered" ? "text-emerald-400" :
                          cart.status === "Pending" ? "text-amber-400" :
                          "text-rose-400"
                        }`}>
                          {cart.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <button className="px-3.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] text-cyan-400 group-hover:text-cyan-300 transition-all text-xs font-semibold flex items-center gap-1 ml-auto">
                        Analyze
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // RENDER: AI Campaigns View
  const renderCampaigns = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
      {/* Campaign List */}
      <div className="lg:col-span-2 space-y-6">
        {/* Campaign Card 1: Email */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Automated Email Campaign</h3>
                <p className="text-xs text-zinc-500 font-sans">Multi-stage smart email sequence triggers</p>
              </div>
            </div>
            {/* Toggle switch */}
            <button 
              onClick={() => {
                setIsEmailEnabled(!isEmailEnabled);
                showToast(`Email campaign ${!isEmailEnabled ? "activated" : "deactivated"}`, "info");
              }}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 ${isEmailEnabled ? 'bg-cyan-500' : 'bg-zinc-800'}`}
            >
              <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform duration-300 ${isEmailEnabled ? 'translate-x-5.5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Workflow Sequence Steps */}
          <div className="relative pl-6 border-l-2 border-zinc-800/80 space-y-6 py-2 ml-4.5">
            <div className="relative">
              <span className="absolute -left-10 top-0.5 h-6 w-6 rounded-full bg-zinc-900 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-white font-mono">1</span>
              <div>
                <h4 className="text-xs font-semibold text-white">Cart Abandonment Trigger</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Detect checkout exit and check user status.</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute -left-10 top-0.5 h-6 w-6 rounded-full bg-zinc-900 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-white font-mono">2</span>
              <div>
                <h4 className="text-xs font-semibold text-white">Sequence Stage 1: Warm Reminder</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Send friendly email prompting user to return. Delay: {delayMinutes} minutes.</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute -left-10 top-0.5 h-6 w-6 rounded-full bg-zinc-900 border-2 border-cyan-400/50 flex items-center justify-center text-[10px] font-bold text-zinc-400 font-mono">3</span>
              <div>
                <h4 className="text-xs font-semibold text-white">Sequence Stage 2: Incentivized Recovery</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Send a custom discount coupon ({discountCode}) if cart remains pending for 24 hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Card 2: WhatsApp */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">WhatsApp Push Conversions</h3>
                <p className="text-xs text-zinc-500 font-sans">Instant chat messaging with dynamic payment links</p>
              </div>
            </div>
            {/* Toggle switch */}
            <button 
              onClick={() => {
                setIsWhatsAppEnabled(!isWhatsAppEnabled);
                showToast(`WhatsApp campaign ${!isWhatsAppEnabled ? "activated" : "deactivated"}`, "info");
              }}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 ${isWhatsAppEnabled ? 'bg-emerald-500' : 'bg-zinc-800'}`}
            >
              <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform duration-300 ${isWhatsAppEnabled ? 'translate-x-5.5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="relative pl-6 border-l-2 border-zinc-800/80 space-y-6 py-2 ml-4.5">
            <div className="relative">
              <span className="absolute -left-10 top-0.5 h-6 w-6 rounded-full bg-zinc-900 border-2 border-emerald-400 flex items-center justify-center text-[10px] font-bold text-white font-mono">1</span>
              <div>
                <h4 className="text-xs font-semibold text-white">WhatsApp Broadcast Trigger</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Initiate push after 10m if email bounces or remains unopened.</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute -left-10 top-0.5 h-6 w-6 rounded-full bg-zinc-900 border-2 border-emerald-400/50 flex items-center justify-center text-[10px] font-bold text-zinc-400 font-mono">2</span>
              <div>
                <h4 className="text-xs font-semibold text-white">WhatsApp Agent Link Dispatch</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Send a short, customized checkout session URL directly to the user's number.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Card 3: AI Voice Agent (Autonomous calls) */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 animate-pulse-glow">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">AI Voice Phone Agent</h3>
                <p className="text-xs text-zinc-500 font-sans">Autonomous phone calls resolving checkout friction</p>
              </div>
            </div>
            {/* Toggle switch */}
            <button 
              onClick={() => {
                setIsAiCallEnabled(!isAiCallEnabled);
                showToast(`AI Phone Call campaign ${!isAiCallEnabled ? "activated" : "deactivated"}`, "info");
              }}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 ${isAiCallEnabled ? 'bg-purple-500' : 'bg-zinc-800'}`}
            >
              <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform duration-300 ${isAiCallEnabled ? 'translate-x-5.5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="relative pl-6 border-l-2 border-zinc-800/80 space-y-6 py-2 ml-4.5">
            <div className="relative">
              <span className="absolute -left-10 top-0.5 h-6 w-6 rounded-full bg-zinc-900 border-2 border-purple-400 flex items-center justify-center text-[10px] font-bold text-white font-mono">1</span>
              <div>
                <h4 className="text-xs font-semibold text-white">Voice Agent Queuing</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Select high-value pending carts (value &gt; ₹10,000) abandoned for &gt; 2 hours.</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute -left-10 top-0.5 h-6 w-6 rounded-full bg-zinc-900 border-2 border-purple-400/50 flex items-center justify-center text-[10px] font-bold text-zinc-400 font-mono">2</span>
              <div>
                <h4 className="text-xs font-semibold text-white">Custom Dialog Generation</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Generate customized conversation scripts dynamically based on cart item categories.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Settings Panel */}
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <SettingsIcon className="h-4.5 w-4.5 text-cyan-400" />
            AI Sequence Parameters
          </h3>

          {/* Delay Minutes input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 font-medium">Initial Sequence Delay (Minutes)</label>
            <input 
              type="number" 
              value={delayMinutes} 
              onChange={(e) => setDelayMinutes(Math.max(1, parseInt(e.target.value) || 15))}
              className="h-10 px-4 rounded-xl text-sm glass-input text-white w-full"
            />
            <p className="text-[10px] text-zinc-500">Wait duration before first email alert goes out.</p>
          </div>

          {/* Discount code */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 font-medium">AI Discount Incentive Code</label>
            <input 
              type="text" 
              value={discountCode} 
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              className="h-10 px-4 rounded-xl text-sm glass-input text-white w-full"
            />
            <p className="text-[10px] text-zinc-500 font-sans">Used during final-stage Email/WhatsApp triggers.</p>
          </div>

          {/* Voice Gender */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 font-medium">Voice Synthesizer Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setAiVoiceGender("female")}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  aiVoiceGender === "female" 
                    ? "bg-purple-500/25 border-purple-500 text-white" 
                    : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white"
                }`}
              >
                Female Agent
              </button>
              <button 
                onClick={() => setAiVoiceGender("male")}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  aiVoiceGender === "male" 
                    ? "bg-purple-500/25 border-purple-500 text-white" 
                    : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white"
                }`}
              >
                Male Agent
              </button>
            </div>
          </div>

          {/* Voice Tone */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 font-medium">AI Dialogue Tone Accent</label>
            <select
              value={aiVoiceTone}
              onChange={(e) => setAiVoiceTone(e.target.value)}
              className="h-10 px-4 rounded-xl text-sm glass-input text-white w-full pr-4 bg-zinc-950"
            >
              <option value="empathetic">Empathetic & Warm</option>
              <option value="professional">Professional & Direct</option>
              <option value="casual">Casual & Friendly</option>
              <option value="urgent">Urgent & High Intensity</option>
            </select>
          </div>

          {/* Save Button */}
          <button 
            onClick={() => showToast("AI Sequence configurations saved successfully!", "success")}
            className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-cyan-500/10 active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4.5 w-4.5 text-white" />
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );

  // RENDER: Advanced Analytics View
  const renderAnalytics = () => (
    <div className="space-y-8 animate-slide-up">
      {/* Analytics Funnel & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-1">Conversion Funnel Progression</h3>
            <p className="text-xs text-zinc-500 mb-6">Drop-offs at each stage of automated recovery campaigns</p>

            <div className="space-y-5">
              {/* Funnel Stage 1 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">1. Total Abandoned Carts</span>
                  <span className="text-white font-mono">18 Carts (100%)</span>
                </div>
                <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              {/* Funnel Stage 2 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">2. Automated Recovery Sent</span>
                  <span className="text-white font-mono">15 Carts (83%)</span>
                </div>
                <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" style={{ width: "83.3%" }} />
                </div>
              </div>

              {/* Funnel Stage 3 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">3. Recovery Links Clicked</span>
                  <span className="text-white font-mono">12 Carts (66%)</span>
                </div>
                <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full" style={{ width: "66.6%" }} />
                </div>
              </div>

              {/* Funnel Stage 4 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">4. Recovered checkouts</span>
                  <span className="text-emerald-400 font-mono">10 Carts (55%)</span>
                </div>
                <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" style={{ width: "55.5%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-xs text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>AI Funnel conversion efficiency: <strong>+18.4% above average benchmark</strong></span>
          </div>
        </div>

        {/* Exporter Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-2">Export Data & Reports</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Export historical timeseries data of recovering checkouts, revenue logs, message metrics, and system activity logs into spreadsheet format.
            </p>

            <div className="mt-6 space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-center justify-between text-xs">
                <span className="text-zinc-300">Period Date Range</span>
                <span className="font-semibold text-white capitalize">{dateRange === "today" ? "Today" : dateRange === "7days" ? "7 Days" : dateRange === "30days" ? "30 Days" : "All Time"}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-center justify-between text-xs">
                <span className="text-zinc-300">Target File Format</span>
                <span className="font-semibold text-white font-mono">CSV (.csv)</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleExportData}
            className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold transition-all border border-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-2.5 active:scale-[0.98]"
          >
            <Download className="h-4.5 w-4.5 text-cyan-400" />
            Download CSV Report
          </button>
        </div>
      </div>

      {/* Checkout Abandonment Pattern Map (Scatter plot representation) */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-sm font-semibold text-white tracking-wide mb-1">Abandonment Hour Patterns</h3>
        <p className="text-xs text-zinc-500 mb-6">Visual distribution of cart abandonments by time of day and week</p>

        {/* Custom mock Heatmap grid */}
        <div className="grid grid-cols-8 gap-1.5 font-mono text-[10px] text-center select-none text-zinc-500">
          <div className="h-6 flex items-center justify-start text-left text-xs font-semibold text-zinc-400">Day/Hour</div>
          <div>08:00</div>
          <div>10:00</div>
          <div>12:00</div>
          <div>14:00</div>
          <div>16:00</div>
          <div>18:00</div>
          <div>20:00</div>

          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <>
              <div key={day} className="h-8 flex items-center justify-start text-xs font-semibold text-zinc-400">{day}</div>
              <div className="bg-cyan-500/10 border border-cyan-500/5 rounded-lg h-8 flex items-center justify-center text-cyan-300">2</div>
              <div className="bg-cyan-500/30 border border-cyan-500/10 rounded-lg h-8 flex items-center justify-center text-cyan-100">6</div>
              <div className="bg-cyan-500/40 border border-cyan-500/20 rounded-lg h-8 flex items-center justify-center text-white font-bold">11</div>
              <div className="bg-cyan-500/20 border border-cyan-500/10 rounded-lg h-8 flex items-center justify-center text-cyan-200">4</div>
              <div className="bg-cyan-500/10 border border-cyan-500/5 rounded-lg h-8 flex items-center justify-center text-cyan-300">2</div>
              <div className="bg-cyan-500/50 border border-cyan-500/30 rounded-lg h-8 flex items-center justify-center text-white font-black animate-pulse">15</div>
              <div className="bg-cyan-500/30 border border-cyan-500/10 rounded-lg h-8 flex items-center justify-center text-cyan-100">7</div>
            </>
          ))}
        </div>
        
        {/* Heatmap Legend */}
        <div className="flex gap-4 items-center justify-end mt-4 text-[10px] text-zinc-400">
          <span>Less Active</span>
          <div className="flex gap-1">
            <span className="h-3 w-4 rounded bg-cyan-500/10" />
            <span className="h-3 w-4 rounded bg-cyan-500/20" />
            <span className="h-3 w-4 rounded bg-cyan-500/30" />
            <span className="h-3 w-4 rounded bg-cyan-500/40" />
            <span className="h-3 w-4 rounded bg-cyan-500/50" />
          </div>
          <span>Highly Active (Friction)</span>
        </div>
      </div>
    </div>
  );

  // RENDER: Settings View
  const renderSettings = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
      {/* Settings Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* API Integration Settings */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
          <h3 className="text-base font-semibold text-white tracking-wide border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-400" />
            Platform Integration
          </h3>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 font-medium">Integration Provider Platform</label>
            <select className="h-10 px-4 rounded-xl text-sm glass-input text-white w-full pr-4 bg-zinc-950">
              <option value="shopify">Shopify Store API</option>
              <option value="woocommerce">WooCommerce API</option>
              <option value="magento">Magento / Adobe Commerce</option>
              <option value="custom">Custom Webhook Endpoint</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 font-medium font-mono">RECOVERAI_WEBHOOK_URL</label>
            <div className="relative">
              <input 
                type="text" 
                value="https://api.recoverai.com/v1/webhooks/9302dfbc88" 
                readOnly
                className="w-full h-10 pl-4 pr-16 rounded-xl text-xs glass-input font-mono text-zinc-400 bg-zinc-950/40 cursor-default"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText("https://api.recoverai.com/v1/webhooks/9302dfbc88");
                  showToast("Webhook URL copied to clipboard!", "success");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 py-1 px-2 rounded bg-cyan-500/10 border border-cyan-500/20"
              >
                Copy
              </button>
            </div>
            <p className="text-[10px] text-zinc-500">Provide this endpoint URL in your e-commerce platform settings to stream carts dynamically.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 font-medium">Webhook Security Token</label>
            <input 
              type="password" 
              value="••••••••••••••••••••••••••••••••••••••••" 
              readOnly
              className="h-10 px-4 rounded-xl text-sm glass-input text-zinc-500 bg-zinc-950/40 cursor-default"
            />
          </div>
        </div>

        {/* Database parameters */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
          <h3 className="text-base font-semibold text-white tracking-wide border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" />
            Supabase Connection Check
          </h3>

          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-xs leading-relaxed text-zinc-300 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Database Synchronized:</span>
              <p className="mt-1">
                Your console is synced with Supabase Project Reference <strong className="font-mono text-white text-[11px]">jynamrkvddtdkxzcusvb</strong>. 
                Any recovery status change or manual override updates the core analytics tables live.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">PROJECT URL</span>
              <span className="text-xs text-white truncate font-mono bg-zinc-950/40 p-2.5 rounded-lg border border-white/[0.04]">https://jynamrkvddtdkxzcusvb.supabase.co</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">ANON KEY STATUS</span>
              <span className="text-xs text-emerald-400 font-mono bg-zinc-950/40 p-2.5 rounded-lg border border-white/[0.04] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active / Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Sidebar settings */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[300px]">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide border-b border-white/[0.06] pb-3 mb-4">
            Console Profile
          </h3>

          <div className="flex flex-col items-center text-center p-4 border border-white/[0.03] rounded-xl bg-white/[0.01]">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Profile" 
              className="h-16 w-16 rounded-2xl object-cover ring-4 ring-cyan-500/10 mb-3"
            />
            <span className="text-sm font-bold text-white">Acme E-commerce Ltd.</span>
            <span className="text-xs text-zinc-500 mt-0.5">Enterprise Member</span>
            
            <span className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              <Lock className="h-3.5 w-3.5" />
              Pro License
            </span>
          </div>
        </div>

        <button 
          onClick={() => showToast("Profile configurations saved!", "success")}
          className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-cyan-500/10 active:scale-[0.98]"
        >
          Save Profile
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-950 select-none text-white font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar 
          activeTab={activeTab} 
          dateRange={dateRange} 
          setDateRange={setDateRange}
          onRefresh={fetchAnalytics}
          isRefreshing={isRefreshing}
        />

        {/* View Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {isRefreshing && !analytics ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <span className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></span>
                <span className="text-xs text-zinc-500 font-semibold font-mono">Synchronizing Supabase Stream...</span>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "overview" && renderOverview()}
              {activeTab === "carts" && renderCarts()}
              {activeTab === "campaigns" && renderCampaigns()}
              {activeTab === "analytics" && renderAnalytics()}
              {activeTab === "settings" && renderSettings()}
            </>
          )}
        </main>
      </div>

      {/* Drill-down Drawer Panel (Slides open from right) */}
      {selectedCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay Backdrop */}
          <div 
            onClick={() => setSelectedCart(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-md h-full bg-zinc-950/95 backdrop-blur-md border-l border-zinc-800 shadow-2xl p-6 flex flex-col justify-between animate-slide-up z-10">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">DRILL-DOWN TRANSACTION</span>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                    Cart ID: <span className="font-mono text-cyan-400">#{selectedCart.id}</span>
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedCart(null)}
                  className="h-8 w-8 rounded-lg hover:bg-white/[0.04] text-zinc-500 hover:text-white flex items-center justify-center transition-colors border border-transparent hover:border-white/[0.06]"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Client Info */}
              <div className="mb-6 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">Client Details</h4>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold uppercase">
                    {selectedCart.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-white truncate">{selectedCart.name}</div>
                    <div className="text-xs text-zinc-500 truncate">{selectedCart.email}</div>
                  </div>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Cart Contents</h4>
                <div className="space-y-3.5 max-h-44 overflow-y-auto pr-1">
                  {selectedCart.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <div>
                        <div className="text-zinc-200 font-semibold">{item.name}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Qty: {item.qty} × ₹{item.price.toLocaleString()}</div>
                      </div>
                      <span className="font-semibold text-white font-mono">₹{(item.qty * item.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/[0.04] text-sm">
                  <span className="font-bold text-zinc-300">Total Cart Value</span>
                  <span className="font-bold text-white text-base font-mono text-neon-cyan">₹{selectedCart.value.toLocaleString()}</span>
                </div>
              </div>

              {/* Timeline recovery logs */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4.5">Autonomous Log Timeline</h4>
                <div className="relative pl-4 border-l border-zinc-800 space-y-4 py-1 ml-2">
                  {selectedCart.timeline.map((event: any, index: number) => (
                    <div key={index} className="relative">
                      <span className="absolute -left-5 top-1 h-2 w-2 rounded-full bg-cyan-400 ring-4 ring-cyan-500/10" />
                      <div className="text-xs">
                        <span className="text-zinc-500 font-mono mr-2">{event.time}</span>
                        <span className="text-zinc-200 leading-normal">{event.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons at bottom */}
            {selectedCart.status !== "Recovered" ? (
              <div className="mt-8 border-t border-white/[0.06] pt-5">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Manual Agent Interventions</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <button 
                    onClick={() => handleManualAction(selectedCart.id, "WhatsApp Reminder")}
                    className="h-10 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/20 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Push WhatsApp
                  </button>
                  <button 
                    onClick={() => handleManualAction(selectedCart.id, "AI Call")}
                    className="h-10 text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/20 hover:border-purple-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Volume2 className="h-4 w-4" />
                    Voice Call Agent
                  </button>
                  <button 
                    onClick={() => handleManualAction(selectedCart.id, "Discount Email")}
                    className="col-span-2 h-10 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/5"
                  >
                    <Percent className="h-4 w-4" />
                    Trigger 15% Discount Email
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 border-t border-white/[0.06] pt-5">
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span>This cart was successfully recovered. No further action needed.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating System Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel p-4 rounded-xl border border-zinc-800 shadow-2xl flex items-center gap-3 animate-slide-up">
          {toastType === "success" ? (
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <Sparkles className="h-5 w-5 text-cyan-400 shrink-0" />
          )}
          <span className="text-xs text-white font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}