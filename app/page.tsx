"use client"
import React from 'react'
import { supabase } from '@/lib/supabase'
import Button from '@mui/joy/Button';
import DashboardCard from "./components/card";

const onHandleClick = async () => {
  const data =
    await supabase
      .from("analytics")
      .select("*")
      .order("date", { ascending: false })
      .limit(1)

  console.log(data);
}

const Home = () => {
  return (
    <div>
      <Button onClick={onHandleClick}>Fetch Data</Button>

      <div className="grid grid-cols-4 gap-6">
        <DashboardCard
          title="Revenue Recovered"
          value="₹54,000"
          progress={80}
        />

        <DashboardCard
          title="Total Carts"
          value="120"
          progress={60}
        />

        <DashboardCard
          title="Recovery Rate"
          value="28%"
          progress={28}
        />

        <DashboardCard
          title="Pending Carts"
          value="40"
          progress={40}
        />
      </div>
    </div>
  )
}

export default Home