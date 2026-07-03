import { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, ArrowRight, CheckCircle2, Users, AlertTriangle } from "lucide-react";
import { getKpi, getFleetStatus, type KpiProps, type FleetStatusProps } from "../../api/routeOps";

const API_URL = import.meta.env.VITE_API_URL as string;

interface RencanaItemProps {
  driver_id: string;
  driver_nama: string;
  halte_tujuan: string;
  skor_urgensi: number;
  rute_diusulkan: string;
  alasan: string;
}

type StatusProses = "idle" | "berpikir" | "rencana_siap" | "mengeksekusi" | "selesai";

const AutoDispatchAI = () => {
  const [status, setStatus] = useState<StatusProses>("idle");
  const [langkahTampil, setLangkahTampil] = useState<string[]>([]);
  const [rencana, setRencana] = useState<RencanaItemProps[]>([]);
  const [catatan, setCatatan] = useState("");
  const [kpi, setKpi] = useState<KpiProps | null>(null);
  const [fleet, setFleet] = useState<FleetStatusProps | null>(null);

  useEffect(() => {
    const fetchRingkasan = () => {
      getKpi().then(setKpi);
      getFleetStatus().then(setFleet);
    };
    fetchRingkasan();
    const interval = setInterval(fetchRingkasan, 8000);
    return () => clearInterval(interval);
  }, []);

  const jalankanAnalisis = async () => {
    setStatus("berpikir");
    setLangkahTampil([]);
    setRencana([]);

    try {
      const res = await axios.post(`${API_URL}/api/auto-dispatch`);
      const { langkah, rencana: rencanaHasil, catatan: catatanHasil } = res.data;

      for (let i = 0; i < langkah.length; i++) {
        await new Promise((r) => setTimeout(r, 500));
        setLangkahTampil((prev) => [...prev, langkah[i]]);
      }

      await new Promise((r) => setTimeout(r, 300));
      setRencana(rencanaHasil);
      setCatatan(catatanHasil);
      setStatus("rencana_siap");
    } catch (error) {
      console.error(error);
      setLangkahTampil((prev) => [...prev, "Terjadi kesalahan saat menganalisis."]);
      setStatus("idle");
    }
  };

  const konfirmasiEksekusi = async () => {
    setStatus("mengeksekusi");
    try {
      await axios.post(`${API_URL}/api/auto-dispatch/execute`, { rencana });
      await new Promise((r) => setTimeout(r, 500));
      setStatus("selesai");
    } catch (error) {
      console.error(error);
      setStatus("rencana_siap");
    }
  };

  const reset = () => {
    setStatus("idle");
    setLangkahTampil([]);
    setRencana([]);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-blue-800">
          <Sparkles className="size-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-lg text-blue-800">AI Auto Dispatch</p>
          <p className="text-xs text-neutral-400">
            Sensor lapangan diproses AI untuk mengusulkan penugasan driver secara otomatis.
          </p>
        </div>
      </div>

      {/* Ringkasan cepat - selalu tampil, mengganti kesan "log terminal" jadi "AI berbicara" */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 border border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-green-700">
            {kpi ? kpi.driver_aktif : "-"} Driver Aktif
          </span>
        </div>
        {fleet && fleet.emergency > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-50 border border-red-200">
            <AlertTriangle className="size-3.5 text-red-600" />
            <span className="text-sm font-medium text-red-700">{fleet.emergency} Emergency</span>
          </div>
        )}
        {kpi && kpi.alert_count > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-yellow-50 border border-yellow-200">
            <AlertTriangle className="size-3.5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">
              AI menemukan {kpi.alert_count} hal yang perlu perhatian
            </span>
          </div>
        )}
      </div>

      {status === "idle" && (
        <button
          type="button"
          onClick={jalankanAnalisis}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-800 text-white
          font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          <Sparkles className="size-4" />
          Jalankan Analisis AI
        </button>
      )}

      {/* Langkah AI - ditampilkan sebagai AI "berbicara" step by step, bukan terminal */}
      {status === "berpikir" && (
        <div className="flex flex-col gap-2 mb-2">
          {langkahTampil.map((l, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-neutral-600">{l}</p>
            </div>
          ))}
          <div className="flex items-center gap-2 text-neutral-400">
            <Sparkles className="size-4 animate-pulse" />
            <p className="text-sm">AI sedang menganalisis...</p>
          </div>
        </div>
      )}

      {status === "rencana_siap" && (
        <div>
          {rencana.length === 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200 mb-3">
              <Sparkles className="size-5 text-blue-700 shrink-0 mt-0.5" />
              <p className="text-sm text-neutral-600">{catatan}</p>
            </div>
          )}

          {rencana.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wide">
                AI Recommendation
              </p>
              <div className="flex flex-col gap-2">
                {rencana.map((r, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white"
                  >
                    <div className="p-2 rounded-full bg-blue-800 shrink-0">
                      <Users className="size-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900">
                        Tugaskan {r.driver_nama} <ArrowRight className="inline size-3.5 mx-1" />{" "}
                        {r.halte_tujuan}{" "}
                        <span className="text-xs font-normal text-neutral-500">
                          (rute {r.rute_diusulkan.toUpperCase()})
                        </span>
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">{r.alasan}</p>
                    </div>
                    <span className="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full shrink-0">
                      Skor {r.skor_urgensi}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {rencana.length > 0 && (
              <button
                type="button"
                onClick={konfirmasiEksekusi}
                className="px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium
                hover:opacity-90 active:scale-95 transition-all"
              >
                Approve Dispatch
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              className="px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-600 text-sm
              hover:bg-neutral-50 active:scale-95 transition-all"
            >
              Batal
            </button>
          </div>

          {rencana.length > 0 && <p className="text-[11px] text-neutral-400 italic mt-3">{catatan}</p>}
        </div>
      )}

      {status === "mengeksekusi" && (
        <div className="flex items-center gap-2 text-neutral-500">
          <Sparkles className="size-4 animate-pulse" />
          <p className="text-sm">Menugaskan driver...</p>
        </div>
      )}

      {status === "selesai" && (
        <div>
          <div className="flex items-center gap-2 text-green-600 mb-3">
            <CheckCircle2 className="size-5" />
            <p className="font-medium">
              {rencana.length} driver berhasil ditugaskan. Cek Dashboard Driver mereka.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-600 text-sm
            hover:bg-neutral-50 active:scale-95 transition-all"
          >
            Jalankan Lagi
          </button>
        </div>
      )}
    </div>
  );
};

export default AutoDispatchAI;