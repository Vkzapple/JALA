import { usePrediksiSekarang } from "../../api/routePrediksi";

const WARNA_LEVEL: Record<string, string> = {
  TINGGI: "bg-red-100 text-red-700 border-red-300",
  SEDANG: "bg-yellow-100 text-yellow-700 border-yellow-300",
  RENDAH: "bg-green-100 text-green-700 border-green-300",
  TUTUP: "bg-neutral-100 text-neutral-500 border-neutral-300",
};

const PrediksiElem = () => {
  const prediksi = usePrediksiSekarang(60000); 

  return (
    <main className="mt-4 p-4 border border-neutral-200 rounded-2xl">
      <p className="text-neutral-800 font-semibold mb-1">
        Prediksi Kepadatan (AI)
      </p>
      <p className="text-xs text-neutral-400 mb-3">
        Estimasi permintaan penumpang saat ini, berdasarkan pola historis.
      </p>

      {!prediksi && (
        <p className="text-sm text-neutral-400">Memuat prediksi...</p>
      )}

      {prediksi && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              {prediksi.nama_hari}, jam {prediksi.jam}:00
            </p>
            <p className="text-2xl font-bold text-blue-800">
              {prediksi.level_kepadatan === "TUTUP"
                ? "-"
                : `~${Math.round(prediksi.estimasi_permintaan)} orang`}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              WARNA_LEVEL[prediksi.level_kepadatan]
            }`}
          >
            {prediksi.level_kepadatan}
          </span>
        </div>
      )}

      {prediksi?.catatan && (
        <p className="text-xs text-neutral-400 mt-2">{prediksi.catatan}</p>
      )}
    </main>
  );
};

export default PrediksiElem;