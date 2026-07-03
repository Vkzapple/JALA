import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingDown, Users, Zap, AlertTriangle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL as string;

interface SkorUrgensiProps {
  nama_halte: string;
  skor_urgensi: number;
  sumber_data: "sensor_real" | "estimasi_pola";
}

interface InsightUtamaProps {
  judul: string;
  probabilitas: number;
  alasan: string;
  rekomendasi: string;
}

interface InsightDataProps {
  insight_utama: InsightUtamaProps | null;
  skor_urgensi: SkorUrgensiProps[];
  simulasi_waktu_tunggu: {
    sebelum_menit: number;
    sesudah_menit: number;
    persen_penurunan: number;
  };
  proyeksi_dampak: {
    penumpang_terbantu_per_hari: number;
    penumpang_terbantu_per_minggu: number;
  };
  catatan_metodologi: string;
}

const WARNA_SKOR = (skor: number) => {
  if (skor >= 70) return "bg-red-500";
  if (skor >= 40) return "bg-yellow-400";
  return "bg-green-400";
};

const AIInsightPanel = () => {
  const [data, setData] = useState<InsightDataProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${API_URL}/api/insight`)
        .then((res) => setData(res.data))
        .catch((err) => console.error("Gagal memuat insight:", err))
        .finally(() => setLoading(false));
    };
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="text-sm text-neutral-400">Memuat AI Insight...</p>;
  }

  if (!data) {
    return (
      <p className="text-sm text-red-500">
        Gagal memuat insight. Pastikan backend & model_api.py berjalan.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Zap className="size-5 text-blue-800" />
        <p className="font-bold text-lg text-blue-800">AI Insight & Dampak</p>
      </div>
      <p className="text-xs text-neutral-400 mb-5">
        Analisis gabungan prediksi AI dan data sensor real-time JALA.
      </p>

      {/* Today's Insight - AI "berbicara" satu headline paling penting, bukan sekadar angka */}
      {data.insight_utama && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-200">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-red-500 uppercase tracking-wide">
            <AlertTriangle className="size-3.5" />
            Today's Insight
          </div>
          <p className="font-semibold text-neutral-800 mb-3">{data.insight_utama.judul}</p>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">Probability</p>
              <p className="text-xl font-bold text-red-600">{data.insight_utama.probabilitas}%</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">Reason</p>
              <p className="text-neutral-700 text-xs leading-snug">{data.insight_utama.alasan}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-0.5">Recommendation</p>
              <p className="text-neutral-700 text-xs leading-snug font-medium">{data.insight_utama.rekomendasi}</p>
            </div>
          </div>
        </div>
      )}

      {/* Proyeksi Dampak - angka besar */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-1 text-blue-700 mb-1">
            <Users className="size-4" />
            <p className="text-xs font-medium">Estimasi Terbantu / Minggu</p>
          </div>
          <p className="text-3xl font-bold text-blue-800">
            ~{data.proyeksi_dampak.penumpang_terbantu_per_minggu}
          </p>
          <p className="text-xs text-neutral-400">perjalanan warga</p>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-1 text-green-700 mb-1">
            <TrendingDown className="size-4" />
            <p className="text-xs font-medium">Penurunan Waktu Tunggu</p>
          </div>
          <p className="text-3xl font-bold text-green-700">
            {data.simulasi_waktu_tunggu.persen_penurunan}%
          </p>
          <p className="text-xs text-neutral-400">
            {data.simulasi_waktu_tunggu.sebelum_menit} mnt → {data.simulasi_waktu_tunggu.sesudah_menit} mnt
          </p>
        </div>
      </div>

      {/* Before/After Bar Visual */}
      <div className="mb-6">
        <p className="text-xs font-medium text-neutral-500 mb-2">
          Simulasi Waktu Tunggu: Tanpa JALA vs Dengan JALA
        </p>
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-xs w-24 text-neutral-500">Tanpa JALA</span>
          <div className="flex-1 bg-neutral-100 rounded-full h-5 overflow-hidden">
            <div
              className="bg-red-300 h-full rounded-full"
              style={{ width: "100%" }}
            ></div>
          </div>
          <span className="text-xs w-14 text-right text-neutral-600">
            {data.simulasi_waktu_tunggu.sebelum_menit}m
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs w-24 text-neutral-500">Dengan JALA</span>
          <div className="flex-1 bg-neutral-100 rounded-full h-5 overflow-hidden">
            <div
              className="bg-green-400 h-full rounded-full"
              style={{
                width: `${(data.simulasi_waktu_tunggu.sesudah_menit / data.simulasi_waktu_tunggu.sebelum_menit) * 100}%`,
              }}
            ></div>
          </div>
          <span className="text-xs w-14 text-right text-neutral-600">
            {data.simulasi_waktu_tunggu.sesudah_menit}m
          </span>
        </div>
      </div>

      {/* Leaderboard Skor Urgensi */}
      <div>
        <p className="text-xs font-medium text-neutral-500 mb-2">
          Skor Urgensi Halte (perlu perhatian segera)
        </p>
        <div className="flex flex-col gap-1.5">
          {data.skor_urgensi.slice(0, 6).map((h, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs w-32 truncate text-neutral-600">{h.nama_halte}</span>
              <div className="flex-1 bg-neutral-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`${WARNA_SKOR(h.skor_urgensi)} h-full rounded-full transition-all`}
                  style={{ width: `${h.skor_urgensi}%` }}
                ></div>
              </div>
              <span className="text-xs w-8 text-right text-neutral-500">{h.skor_urgensi}</span>
              {h.sumber_data === "sensor_real" && (
                <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
                  LIVE
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-neutral-400 italic mt-4 pt-3 border-t border-neutral-100">
        {data.catatan_metodologi}
      </p>
    </div>
  );
};

export default AIInsightPanel;