"use client"
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Button from '@mui/joy/Button';
import DashboardCard from "./components/card";
import { getCardData } from "./config/constants";

const onHandleClick = async (setAnalytics: any) => {
  const { data, error } = await supabase
    .from("analytics")
    .select("*")
    .order("date", { ascending: false })
    .limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (data && data.length > 0) {
    setAnalytics(data[0]);
  }
};



const Home = () => {
  const [analytics, setAnalytics] = useState<any>(null)
  const cardData = getCardData(analytics);
  return (
    <div>
      <Button onClick={() => onHandleClick(setAnalytics)}>Fetch Data</Button>

      <div className="grid grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            progress={card.progress}
          />
        ))}
      </div>
    </div>
  )
}

export default Home