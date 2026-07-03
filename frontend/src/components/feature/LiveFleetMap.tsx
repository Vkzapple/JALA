import { useEffect, useState } from "react";
import { Map, MapControls, MapMarker, MapPopup, MarkerContent } from "../ui/map";
import { BusFrontIcon, Gauge, Clock, Navigation2, Users, Sparkles } from "lucide-react";
import { getDaftarDriver, getHalteAktif, type DriverProps, type HalteAktifProps, type AiStatusDriver } from "../../api/routeOps";

const REFRESH_MS = 5000;

const WARNA_AI_STATUS: Record<AiStatusDriver, { bg: string; label: string; text: string }> = {
  normal: { bg: "bg-green-500", label: "Normal", text: "text-green-700" },
  delay: { bg: "bg-yellow-400", label: "Delay", text: "text-yellow-700" },
  out_of_route: { bg: "bg-red-500", label: "Out of Route", text: "text-red-700" },
  idle: { bg: "bg-blue-500", label: "Idle", text: "text-blue-700" },
  emergency: { bg: "bg-red-600", label: "Emergency", text: "text-red-700" },
  offline: { bg: "bg-neutral-400", label: "Offline", text: "text-neutral-500" },
};

const LiveFleetMap = () => {
  const [drivers, setDrivers] = useState<DriverProps[]>([]);
  const [halteAktif, setHalteAktif] = useState<HalteAktifProps[]>([]);
  const [terpilih, setTerpilih] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [d, h] = await Promise.all([getDaftarDriver(), getHalteAktif()]);
      setDrivers(d);
      setHalteAktif(h);
    };
    fetchData();
    const interval = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  const mapStyle = {
    light: "https://tiles.openfreemap.org/styles/liberty",
    dark: "https://tiles.openfreemap.org/styles/liberty",
  };

  const driverDenganPosisi = drivers.filter(
    (d) => d.lat !== undefined && d.lat !== null && d.lon !== undefined && d.lon !== null,
  );

  const driverTerpilih = driverDenganPosisi.find((d) => d.driver_id === terpilih);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-neutral-800">Live Fleet Map</p>
          <p className="text-xs text-neutral-400">Pusat operasi - klik ikon bus untuk detail driver</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          {(Object.keys(WARNA_AI_STATUS) as AiStatusDriver[])
            .filter((k) => k !== "offline")
            .map((k) => (
              <span key={k} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${WARNA_AI_STATUS[k].bg}`} />
                {WARNA_AI_STATUS[k].label}
              </span>
            ))}
        </div>
      </div>

      <div className="w-full h-96 rounded-xl overflow-hidden">
        <Map center={[106.8456, -6.2088]} zoom={11} styles={mapStyle}>
          <MapControls showZoom showCompass position="top-right" />

          {halteAktif.map((h, idx) => (
            <MapMarker key={`halte-${idx}`} longitude={h.koordinat_y} latitude={h.koordinat_x}>
              <MarkerContent>
                <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow" title={h.nama_halte} />
              </MarkerContent>
            </MapMarker>
          ))}

          {driverDenganPosisi.map((d) => {
            const aiStatus = d.ai_status ?? "idle";
            const warna = WARNA_AI_STATUS[aiStatus];
            return (
              <MapMarker
                key={d.driver_id}
                longitude={d.lon as number}
                latitude={d.lat as number}
                onClick={() => setTerpilih(d.driver_id)}
              >
                <MarkerContent>
                  <div
                    className={`relative w-8 h-8 rounded-full ${warna.bg} border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
                  >
                    <BusFrontIcon className="size-4 text-white" />
                    {aiStatus === "emergency" && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                      </span>
                    )}
                  </div>
                </MarkerContent>
              </MapMarker>
            );
          })}

          {driverTerpilih && (
            <MapPopup
              longitude={driverTerpilih.lon as number}
              latitude={driverTerpilih.lat as number}
              onClose={() => setTerpilih(null)}
              closeButton
            >
              <div className="w-56">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-neutral-800">{driverTerpilih.nama}</p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${WARNA_AI_STATUS[driverTerpilih.ai_status ?? "idle"].text} bg-neutral-100`}
                  >
                    {WARNA_AI_STATUS[driverTerpilih.ai_status ?? "idle"].label}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mb-3">
                  Rute {driverTerpilih.rute_assigned?.toUpperCase() ?? "-"}
                </p>

                <div className="flex flex-col gap-1.5 text-xs text-neutral-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <Gauge className="size-3.5" /> Speed
                    </span>
                    <span className="font-medium">{driverTerpilih.speed_kmh ?? 0} km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <Clock className="size-3.5" /> ETA
                    </span>
                    <span className="font-medium">
                      {driverTerpilih.eta_menit !== null && driverTerpilih.eta_menit !== undefined
                        ? `${driverTerpilih.eta_menit} menit`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <Navigation2 className="size-3.5" /> Deviation
                    </span>
                    <span className="font-medium">{driverTerpilih.deviation_meter ?? 0} m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <Users className="size-3.5" /> Passenger
                    </span>
                    <span className="font-medium">{driverTerpilih.passenger_count ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <Sparkles className="size-3.5" /> AI Status
                    </span>
                    <span className={`font-medium ${WARNA_AI_STATUS[driverTerpilih.ai_status ?? "idle"].text}`}>
                      {WARNA_AI_STATUS[driverTerpilih.ai_status ?? "idle"].label}
                    </span>
                  </div>
                </div>
              </div>
            </MapPopup>
          )}
        </Map>
      </div>

      {driverDenganPosisi.length === 0 && (
        <p className="text-xs text-neutral-400 mt-2">
          Belum ada driver dengan posisi GPS aktif. Driver akan muncul di sini setelah membuka Dashboard Driver dengan GPS menyala.
        </p>
      )}
    </div>
  );
};

export default LiveFleetMap;