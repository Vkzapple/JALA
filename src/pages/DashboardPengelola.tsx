import { useEffect, useState } from "react";
import {
  getHistoriAbsensi,
  type AbsensiRecordProps,
} from "../api/routeOps";
import KPICards from "../components/feature/KPICards";
import AutoDispatchAI from "../components/feature/AutoDispatchAI";
import AIConfidenceCard from "../components/feature/AIConfidenceCard";
import AIQueryBox from "../components/feature/AIQueryBox";
import LiveFleetMap from "../components/feature/LiveFleetMap";
import HeatmapPrediksi from "../components/feature/HeatmapPrediksi";
import AIInsightPanel from "../components/feature/AIInsightPanel";
import RekomendasiAksi from "../components/feature/RekomendasiAksi";
import ManajemenDriver from "../components/feature/ManajemenDriver";
import FleetStatusPanel from "../components/feature/FleetStatusPanel";

const REFRESH_MS = 8000;

const DashboardPengelola = () => {
  const [histori, setHistori] = useState<AbsensiRecordProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setHistori(await getHistoriAbsensi());
    };
    fetchData();
    const interval = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  const alertTerbaru = histori.filter((h) => h.status !== "berhasil").slice(0, 8);

  return (
    <main className="min-h-screen bg-neutral-50 p-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">JALA - AI Control Tower</h1>
          <p className="text-sm text-neutral-500">
            Pusat kendali armada: pantau, prediksi, dan tugaskan driver secara real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={async () => {
              await fetch(`${import.meta.env.VITE_API_URL}/api/demo/seed`, { method: "POST" });
              window.location.reload();
            }}
            className="px-4 py-2 rounded-full bg-blue-800 text-white text-sm font-medium
            hover:opacity-90 active:scale-95 transition-all"
          >
            Muat Data
          </button>
          <button
            type="button"
            onClick={async () => {
              await fetch(`${import.meta.env.VITE_API_URL}/api/demo/reset`, { method: "POST" });
              window.location.reload();
            }}
            className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-600 text-sm
            hover:bg-neutral-50 active:scale-95 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <KPICards />

      {/* ================= AI COMMAND CENTER ================= */}
      <section className="mb-6">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
          AI Command Center
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-sm">
            <AutoDispatchAI />
          </div>
          <div className="flex flex-col gap-4">
            <AIConfidenceCard />
            <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex-1">
              <RekomendasiAksi />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5 mt-4">
          <AIQueryBox />
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="mb-6">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Map</p>
        <div className="bg-white rounded-2xl border border-neutral-200 p-4">
          <LiveFleetMap />
        </div>
      </section>

      {/* ================= ANALYTICS ================= */}
      <section className="mb-6">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Analytics</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-4">
            <p className="font-semibold text-neutral-800 mb-1">Heatmap Prediksi Kepadatan (AI)</p>
            <p className="text-xs text-neutral-400 mb-3">
              Estimasi jumlah penumpang per hari & jam, berdasarkan model prediksi.
            </p>
            <HeatmapPrediksi />
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-4">
            <AIInsightPanel />
          </div>
        </div>
      </section>

      {/* ================= OPERATION ================= */}
      <section>
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Operation</p>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-4">
            <ManajemenDriver />
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-4">
            <FleetStatusPanel />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-4">
          <p className="font-semibold text-neutral-800 mb-3">Recent Alert & Incident</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-400 border-b border-neutral-200">
                  <th className="py-2 pr-4">Waktu</th>
                  <th className="py-2 pr-4">Halte</th>
                  <th className="py-2 pr-4">Jarak</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {alertTerbaru.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-neutral-400">
                      Tidak ada alert / insiden absensi terbaru.
                    </td>
                  </tr>
                )}
                {alertTerbaru.map((h, idx) => (
                  <tr key={idx} className="border-b border-neutral-100">
                    <td className="py-2 pr-4 text-neutral-600">
                      {new Date(h.waktu).toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 pr-4 text-neutral-800 font-medium">{h.id_halte}</td>
                    <td className="py-2 pr-4 text-neutral-600">{h.jarak_meter}m</td>
                    <td className="py-2 pr-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Gagal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardPengelola;