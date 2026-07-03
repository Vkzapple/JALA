import { useEffect, useState } from "react";
import { getFleetStatus, type FleetStatusProps } from "../../api/routeOps";

const REFRESH_MS = 6000;

const ITEM = [
  { key: "running" as const, label: "Running", dot: "bg-green-500", bg: "bg-green-50", text: "text-green-700" },
  { key: "idle" as const, label: "Idle", dot: "bg-yellow-400", bg: "bg-yellow-50", text: "text-yellow-700" },
  { key: "emergency" as const, label: "Emergency", dot: "bg-red-500", bg: "bg-red-50", text: "text-red-700" },
  { key: "offline" as const, label: "Offline", dot: "bg-neutral-500", bg: "bg-neutral-100", text: "text-neutral-600" },
];

const FleetStatusPanel = () => {
  const [fleet, setFleet] = useState<FleetStatusProps | null>(null);

  useEffect(() => {
    const fetchData = () => getFleetStatus().then(setFleet);
    fetchData();
    const interval = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-neutral-800">Fleet Status</p>
        {fleet && <span className="text-xs text-neutral-400">{fleet.total} armada terdaftar</span>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ITEM.map((it) => (
          <div key={it.key} className={`rounded-xl p-3 ${it.bg} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${it.dot}`} />
              <span className={`text-sm font-medium ${it.text}`}>{it.label}</span>
            </div>
            <span className={`text-xl font-bold ${it.text}`}>{fleet ? fleet[it.key] : "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FleetStatusPanel;