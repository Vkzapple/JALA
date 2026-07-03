import { useEffect, useState } from "react";
import type { HalteProps } from "../../api/routeHalte";
import { Map, MapControls, MapMarker, MapRoute, MarkerContent } from "../ui/map";
import { Badge } from "../ui/badge";
import { BusFrontIcon, Navigation } from "lucide-react";
import { fetchRoutes, type RouteData } from "../../api/routemap";
import { useStatusPenumpang, cekAdaPenumpang } from "../../api/routePenumpang";

interface MulaiPerjalananElemProps {
  halteAwal: HalteProps | undefined;
  halteAkhir: HalteProps | undefined;
  onSelesai: () => void;
}

const MulaiPerjalananElem = ({
  halteAwal,
  halteAkhir,
  onSelesai,
}: MulaiPerjalananElemProps) => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [posisiDriver, setPosisiDriver] = useState<GeolocationCoordinates | null>(null);

  const statusPenumpang = useStatusPenumpang(3000);
  const adaPenumpangAwal = cekAdaPenumpang(statusPenumpang, halteAwal?.nama_halte);
  const adaPenumpangAkhir = cekAdaPenumpang(statusPenumpang, halteAkhir?.nama_halte);

  useEffect(() => {
    if (halteAwal && halteAkhir) {
      fetchRoutes(halteAwal, halteAkhir).then((data) => {
        if (data) setRoutes(data);
      });
    }
  }, [halteAwal, halteAkhir]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setPosisiDriver(pos.coords),
      (err) => console.error("Gagal melacak posisi:", err.message),
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const mapStyle = {
    light: "https://tiles.openfreemap.org/styles/bright",
    dark: "https://tiles.openfreemap.org/styles/bright",
  };

  const center = halteAwal
    ? [Number(halteAwal.koordinat_y), Number(halteAwal.koordinat_x)]
    : [106.8456, -6.2088];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header info perjalanan */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 shadow-sm">
        <div>
          <p className="text-xs text-neutral-400">Sedang menuju</p>
          <p className="font-semibold text-blue-800">
            {halteAwal?.nama_halte ?? "-"} → {halteAkhir?.nama_halte ?? "-"}
          </p>
        </div>
        <button
          type="button"
          onClick={onSelesai}
          className="p-2 px-5 rounded-full bg-blue-800 text-white text-sm font-medium
          hover:opacity-90 active:scale-95 transition-all"
        >
          Selesai Perjalanan
        </button>
      </div>

      {/* Full map */}
      <div className="flex-1 relative">
        <Map center={center as [number, number]} zoom={15} styles={mapStyle}>
          <MapControls showZoom showCompass showLocate position="top-right" />

          {routes.map((route, index) => (
            <MapRoute
              key={index}
              coordinates={route.coordinates}
              color="#1e3a8a"
              width={6}
              opacity={0.9}
            />
          ))}

          {halteAwal && (
            <MapMarker longitude={halteAwal.koordinat_y} latitude={halteAwal.koordinat_x}>
              <MarkerContent>
                <div className="relative">
                  {adaPenumpangAwal && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 z-10">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                  )}
                  <Badge className={`bg-red-600 ${adaPenumpangAwal ? "ring-2 ring-orange-400 ring-offset-1" : ""}`}>
                    <BusFrontIcon className="h-36 w-36 text-neutral-100" />
                    <div className="text-neutral-100">
                      {halteAwal.nama_halte}
                      {adaPenumpangAwal && (
                        <span className="block text-[10px] font-semibold text-orange-200">
                          Ada Penumpang
                        </span>
                      )}
                    </div>
                  </Badge>
                </div>
              </MarkerContent>
            </MapMarker>
          )}

          {halteAkhir && (
            <MapMarker longitude={halteAkhir.koordinat_y} latitude={halteAkhir.koordinat_x}>
              <MarkerContent>
                <div className="relative">
                  {adaPenumpangAkhir && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 z-10">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                  )}
                  <Badge className={`bg-green-600 ${adaPenumpangAkhir ? "ring-2 ring-orange-400 ring-offset-1" : ""}`}>
                    <BusFrontIcon className="h-36 w-36 text-neutral-100" />
                    <div className="text-neutral-100">
                      {halteAkhir.nama_halte}
                      {adaPenumpangAkhir && (
                        <span className="block text-[10px] font-semibold text-orange-200">
                          Ada Penumpang
                        </span>
                      )}
                    </div>
                  </Badge>
                </div>
              </MarkerContent>
            </MapMarker>
          )}

          {posisiDriver && (
            <MapMarker longitude={posisiDriver.longitude} latitude={posisiDriver.latitude}>
              <MarkerContent>
                <div className="bg-blue-600 rounded-full p-2 shadow-lg border-2 border-white">
                  <Navigation className="h-4 w-4 text-white" fill="white" />
                </div>
              </MarkerContent>
            </MapMarker>
          )}
        </Map>
      </div>
    </div>
  );
};

export default MulaiPerjalananElem;