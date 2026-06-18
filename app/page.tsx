"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import DashboardCard from "./components/DashboardCard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";

export default function Home() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .order("date", { ascending: false })
      .limit(1);

    if (error) {
      console.log(error);
      return;
    }

    setAnalytics(data?.[0]);
  };

  const cards = [
    {
      title: "Revenue Recovered",
      value: `₹${analytics?.recovered_revenue ?? 0}`,
      progress: analytics?.recovery_rate ?? 0,
    },
    {
      title: "Total Carts",
      value: analytics?.total_carts ?? 0,
      progress: 100,
    },
    {
      title: "Recovered Carts",
      value: analytics?.recovered_carts ?? 0,
      progress: analytics?.recovery_rate ?? 0,
    },
    {
      title: "Pending Carts",
      value: analytics?.pending_carts ?? 0,
      progress: 50,
    },
    {
      title: "Emails Sent",
      value: analytics?.emails_sent ?? 0,
      progress: 100,
    },
    {
      title: "WhatsApp Sent",
      value: analytics?.whatsapp_sent ?? 0,
      progress: 100,
    },
    {
      title: "Calls Sent",
      value: analytics?.calls_sent ?? 0,
      progress: 100,
    },
    {
      title: "Recovery Rate",
      value: `${Math.round(
        analytics?.recovery_rate ?? 0
      )}%`,
      progress: analytics?.recovery_rate ?? 0,
    },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-white text-4xl font-bold mb-8">
            Dashboard
          </h1>

          <div className="grid grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <DashboardCard
                key={index}
                title={card.title}
                value={card.value}
                progress={card.progress}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}