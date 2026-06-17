// config/constants.js

export const getCardData = (analytics) => [
  {
    title: "Revenue Recovered",
    value: `₹${analytics?.recovered_revenue || 0}`,
    progress: analytics?.recovery_rate || 0,
  },
  {
    title: "Total Carts",
    value: analytics?.total_carts || 0,
    progress: 100,
  },
  {
    title: "Recovered Carts",
    value: analytics?.recovered_carts || 0,
    progress: analytics?.recovery_rate || 0,
  },
];