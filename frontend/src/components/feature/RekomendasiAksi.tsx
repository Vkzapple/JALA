import { useEffect, useState } from "react";
import { getRekomendasi, type RekomendasiResponseProps } from "../../api/routeOps";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const WARNA_PRIORITAS: Record<string, string> = {
  TINGGI: "bg-red-50 border-red-300 text-red-700",
  SEDANG: "bg-yellow-50 border-yellow-300 text-yellow-700",
  RENDAH: "bg-green-50 border-green-300 text-green-700",
};

const IKON_PRIORITAS: Record<string, React.ReactNode> = {
  TINGGI: <AlertTriangle className="size-4" />,
  SEDANG: <Info className="size-4" />,
  RENDAH: <CheckCircle className="size-4" />,
};

const RekomendasiAksi = () => {
  const [data, setData] = useState<RekomendasiResponseProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      getRekomendasi().then((res) => {
        setData(res);
        setLoading(false);
      });
    };
    fetchData();
    const interval = setInterval(fetchData, 15000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="text-sm text-neutral-400">Memuat rekomendasi AI...</p>;
  }

  if (!data) {
    return (
      <p className="text-sm text-red-500">
        Gagal memuat rekomendasi. Pastikan model_api.py sedang berjalan.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-neutral-800">Rekomendasi Aksi (AI)</p>
        <span className="text-xs text-neutral-400">
          {data.prediksi_ai.nama_hari}, {data.prediksi_ai.jam}:00
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {data.rekomendasi.length === 0 && (
          <p className="text-sm text-neutral-400">
            Tidak ada rekomendasi khusus saat ini.
          </p>
        )}

        {data.rekomendasi.map((r, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 p-3 rounded-xl border text-sm ${
              WARNA_PRIORITAS[r.prioritas]
            }`}
          >
            <span className="mt-0.5">{IKON_PRIORITAS[r.prioritas]}</span>
            <span>{r.pesan}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-neutral-400 mt-3 italic">{data.catatan}</p>
    </div>
  );
};

export default RekomendasiAksi;