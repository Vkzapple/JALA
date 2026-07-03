import { useEffect, useRef, useState } from "react";
import { Sparkles, MapPin, LocateFixed, AlertCircle } from "lucide-react";
import { mintaSaranRute, type SaranRuteResponseProps } from "../../api/routeOps";
import { routeHandlerAPI } from "../../api/routemap";
import type { Data } from "./RoutesElem";
import type { HalteProps, PenumpangProps } from "../../api/routeHalte";

interface SaranRuteAIProps {
  func: (a: Data, b: HalteProps, c: HalteProps, d: PenumpangProps) => void;
  func2: (order: number) => void;
}

const INTERVAL_CEK_MS = 15000;

const SaranRuteAI = ({ func, func2 }: SaranRuteAIProps) => {
  const [status, setStatus] = useState<"mencari" | "siap" | "gagal_gps">("mencari");
  const [saran, setSaran] = useState<SaranRuteResponseProps | null>(null);
  const lastFetchRef = useRef<number>(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("gagal_gps");
      return;
    }

    const cekPosisi = (lat: number, lon: number) => {
      const sekarang = Date.now();
      if (sekarang - lastFetchRef.current < INTERVAL_CEK_MS) return;
      lastFetchRef.current = sekarang;

      mintaSaranRute(lat, lon).then((hasil) => {
        if (hasil) {
          setSaran(hasil);
          setStatus("siap");
        }
      });
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => cekPosisi(pos.coords.latitude, pos.coords.longitude),
      () => setStatus("gagal_gps"),
      { enableHighAccuracy: true, timeout: 10000 },
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => cekPosisi(pos.coords.latitude, pos.coords.longitude),
      () => setStatus("gagal_gps"),
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleMulaiRute = (kode: string) => {
    const hasil = routeHandlerAPI(kode);
    func(hasil.data_passed, hasil.halte_awal, hasil.halte_akhir, hasil.passenger);
    func2(1);
  };

  if (status === "gagal_gps") {
    return (
      <div className="mt-4 p-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 flex items-start gap-3">
        <AlertCircle className="size-5 text-neutral-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-neutral-600">GPS tidak tersedia</p>
          <p className="text-xs text-neutral-400">
            Aktifkan izin lokasi supaya AI bisa mendeteksi posisi & menyarankan rute otomatis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 to-white">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-full bg-blue-800">
          <Sparkles className="size-3.5 text-white" />
        </div>
        <p className="text-sm font-semibold text-blue-800">AI mendeteksi posisi kamu</p>
      </div>

      {status === "mencari" && (
        <div className="flex items-center gap-2 text-sm text-neutral-400 pl-1">
          <LocateFixed className="size-4 animate-pulse" />
          Melacak lokasi & mencocokkan dengan rute terdekat...
        </div>
      )}

      {status === "siap" && saran && (
        <div className="pl-1">
          <div className="flex items-start gap-1.5 mb-3">
            <MapPin className="size-4 text-blue-700 shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-700">{saran.pesan}</p>
          </div>

          {saran.dalam_radius && saran.rute_disarankan.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {saran.rute_disarankan.map((r) => (
                <button
                  key={r.kode}
                  type="button"
                  onClick={() => handleMulaiRute(r.kode)}
                  className="px-4 py-2 rounded-full bg-blue-800 text-white text-sm font-medium
                  hover:opacity-90 active:scale-95 transition-all"
                >
                  Mulai rute {r.kode.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {!saran.dalam_radius && (
            <p className="text-xs text-neutral-400">
              Terdeteksi {saran.jarak_meter}m dari {saran.halte_terdekat ?? "halte terdekat"}.
              Mendekat ke halte supaya AI bisa menyarankan rute.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SaranRuteAI;