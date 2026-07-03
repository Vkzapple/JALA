import { useEffect, useState } from "react";
import { getPrediksiHeatmap, type PrediksiProps } from "../../api/routePrediksi";

const HEATMAP_WARNA = (nilai: number) => {
  // Skala warna dari hijau (rendah) -> kuning -> merah (tinggi), skala 0-15
  if (nilai >= 12) return "bg-red-600";
  if (nilai >= 9) return "bg-red-400";
  if (nilai >= 6) return "bg-yellow-400";
  if (nilai >= 3) return "bg-yellow-200";
  return "bg-green-200";
};

const HeatmapPrediksi = () => {
  const [data, setData] = useState<PrediksiProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrediksiHeatmap().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const namaHariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const jamList = Array.from({ length: 18 }, (_, i) => i + 5); // jam 5-22

  const cariNilai = (hari: number, jam: number) => {
    return data.find((d) => d.hari === hari && d.jam === jam)?.estimasi_permintaan ?? 0;
  };

  if (loading) {
    return <p className="text-sm text-neutral-400">Memuat heatmap prediksi...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-xs">
        <thead>
          <tr>
            <th className="p-1 text-neutral-400 sticky left-0 bg-white"></th>
            {namaHariList.map((nama) => (
              <th key={nama} className="p-1 text-neutral-500 font-medium">
                {nama.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jamList.map((jam) => (
            <tr key={jam}>
              <td className="p-1 text-neutral-400 pr-2 sticky left-0 bg-white">{jam}:00</td>
              {namaHariList.map((_, hariIdx) => {
                const nilai = cariNilai(hariIdx, jam);
                return (
                  <td key={hariIdx} className="p-0.5">
                    <div
                      title={`${nilai.toFixed(1)} orang`}
                      className={`w-8 h-6 rounded ${HEATMAP_WARNA(nilai)} flex items-center justify-center text-[10px] text-neutral-800`}
                    >
                      {Math.round(nilai)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-3 mt-3 text-xs text-neutral-400">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-200"></div> Rendah
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-400"></div> Sedang
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-600"></div> Tinggi
        </span>
      </div>
    </div>
  );
};

export default HeatmapPrediksi;