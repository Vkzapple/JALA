import { useEffect, useState } from "react";
import { BrainCircuit } from "lucide-react";
import { getKpi } from "../../api/routeOps";

const REFRESH_MS = 10000;

const AIConfidenceCard = () => {
  const [persen, setPersen] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = () => {
      getKpi().then((kpi) => {
        if (kpi) setPersen(kpi.ai_accuracy_percent);
      });
    };
    fetchData();
    const interval = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 34;
  const offset = persen !== null ? circumference - (persen / 100) * circumference : circumference;

  return (
    <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-5 text-white flex items-center gap-4">
      <div className="relative shrink-0">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="#c4b5fd"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 40 40)"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{persen !== null ? `${persen}%` : "-"}</span>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-1 text-purple-200">
          <BrainCircuit className="size-4" />
          <p className="text-xs font-medium uppercase tracking-wide">AI Accuracy Today</p>
        </div>
        <p className="text-sm text-purple-100">
          Estimasi seberapa konsisten kondisi lapangan dengan prediksi & rekomendasi AI hari ini.
        </p>
      </div>
    </div>
  );
};

export default AIConfidenceCard;