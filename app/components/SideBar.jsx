export default function Sidebar() {
  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen p-6">
      <h2 className="text-white text-xl font-bold mb-10">
        RecoverAI
      </h2>

      <div className="space-y-4">
        <p className="text-zinc-300">Dashboard</p>
        <p className="text-zinc-300">Abandoned Carts</p>
        <p className="text-zinc-300">Recovered Orders</p>
        <p className="text-zinc-300">Analytics</p>
        <p className="text-zinc-300">Settings</p>
      </div>
    </div>
  );
}