import { useEffect, useState } from "react";
import { Users, Clock, AlertTriangle, Route as RouteIcon, Sparkles } from "lucide-react";
import { getKpi, type KpiProps } from "../../api/routeOps";

const REFRESH_MS = 8000;

interface KartuProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  warna: string;
}

const Kartu = ({ label, value, icon, warna }: KartuProps) => (
  <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center gap-3">
    <div className={`p-2.5 rounded-xl ${warna}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-neutral-800 leading-tight">{value}</p>
      <p className="text-xs text-neutral-400">{label}</p>
    </div>
  </div>
);

const KPICards = () => {
  const [kpi, setKpi] = useState<KpiProps | null>(null);

  useEffect(() => {
    const fetchData = () => getKpi().then(setKpi);
    fetchData();
    const interval = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Kartu
        label="Driver Aktif"
        value={kpi ? String(kpi.driver_aktif) : "-"}
        icon={<Users className="size-5 text-blue-700" />}
        warna="bg-blue-50"
      />
      <Kartu
        label="On Time"
        value={kpi ? `${kpi.on_time_percent}%` : "-"}
        icon={<Clock className="size-5 text-green-700" />}
        warna="bg-green-50"
      />
      <Kartu
        label="Alert"
        value={kpi ? String(kpi.alert_count) : "-"}
        icon={<AlertTriangle className="size-5 text-red-700" />}
        warna="bg-red-50"
      />
      <Kartu
        label="AI Accuracy"
        value={kpi ? `${kpi.ai_accuracy_percent}%` : "-"}
        icon={<Sparkles className="size-5 text-purple-700" />}
        warna="bg-purple-50"
      />
      <Kartu
        label="Rute Aktif"
        value={kpi ? String(kpi.rute_aktif) : "-"}
        icon={<RouteIcon className="size-5 text-orange-700" />}
        warna="bg-orange-50"
      />
    </div>
  );
};

export default KPICards;