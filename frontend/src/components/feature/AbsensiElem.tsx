import { useState } from "react";
import type { HalteProps } from "../../api/routeHalte";
import { lakukanAbsensi, type HasilAbsensiProps } from "../../api/routeAbsensi";

interface AbsensiElemProps {
  halteAwal: HalteProps | undefined;
  onSukses: () => void;
}

const AbsensiElem = ({ halteAwal, onSukses }: AbsensiElemProps) => {
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<HasilAbsensiProps | null>(null);

  const handleAbsen = async () => {
    if (!halteAwal) return;

    setLoading(true);
    setHasil(null);

    const result = await lakukanAbsensi(halteAwal);
    setHasil(result);
    setLoading(false);

    if (result.success) {
      onSukses();
    }
  };

  return (
    <main className="mt-4 p-4 border border-neutral-200 rounded-2xl">
      <p className="text-neutral-800 font-semibold mb-1">Absensi Driver</p>
      <p className="text-sm text-neutral-400 mb-4">
        Pastikan kamu berada di sekitar halte{" "}
        <span className="font-medium text-blue-800">
          {halteAwal ? halteAwal.nama_halte : "-"}
        </span>{" "}
        untuk bisa absen.
      </p>

      <button
        type="button"
        onClick={handleAbsen}
        disabled={!halteAwal || loading}
        className="p-2 px-4 rounded-full border border-blue-800 shadow text-blue-800
        duration-300 transition-all hover:opacity-75 hover:scale-95
        active:bg-blue-800 active:text-neutral-100 active:scale-90
        disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Memverifikasi lokasi..." : "Verifikasi & Absen"}
      </button>

      {hasil && (
        <p
          className={`mt-3 text-sm font-medium ${
            hasil.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {hasil.message}
        </p>
      )}


      <div className="mt-4 pt-3 border-t border-dashed border-neutral-200">
        <p className="text-xs text-neutral-400 mb-2">Mode testing (skip GPS):</p>
        <button
          type="button"
          onClick={() => {
            setHasil({
              success: true,
              jarak_meter: 0,
              message: "Absen berhasil (mode testing, GPS dilewati).",
            });
            onSukses();
          }}
          disabled={!halteAwal}
          className="p-2 px-4 rounded-full border border-dashed border-orange-400 text-orange-600 text-sm
          hover:bg-orange-50 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Absen Tanpa GPS (Testing)
        </button>
      </div>
    </main>
  );
};

export default AbsensiElem;