import { useEffect, useState } from "react";
import { getDaftarDriver, assignRuteDriver, type DriverProps } from "../../api/routeOps";
import routeData from "../../data/v1.json";
import type { Data } from "./RoutesElem";

const dataRute: Data[] = routeData as Data[];

const WARNA_STATUS: Record<string, string> = {
  idle: "bg-neutral-100 text-neutral-500",
  menuju_halte: "bg-yellow-100 text-yellow-700",
  dalam_perjalanan: "bg-blue-100 text-blue-700",
  offline: "bg-red-100 text-red-700",
};

const LABEL_STATUS: Record<string, string> = {
  idle: "Siap",
  menuju_halte: "Menuju Halte",
  dalam_perjalanan: "Dalam Perjalanan",
  offline: "Offline",
};

const ManajemenDriver = () => {
  const [drivers, setDrivers] = useState<DriverProps[]>([]);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const fetchDrivers = () => {
    getDaftarDriver().then(setDrivers);
  };

  useEffect(() => {
    fetchDrivers();
    const interval = setInterval(fetchDrivers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (driverId: string, rute: string) => {
    if (!rute) return;
    setAssigningId(driverId);
    await assignRuteDriver(driverId, rute);
    await new Promise((r) => setTimeout(r, 300));
    fetchDrivers();
    setAssigningId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-neutral-800">Manajemen Driver</p>
        <span className="text-xs text-neutral-400">{drivers.length} driver terdaftar</span>
      </div>

      {drivers.length === 0 && (
        <p className="text-sm text-neutral-400">
          Belum ada driver yang check-in. Driver akan muncul di sini setelah membuka Dashboard Driver.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {drivers.map((d) => (
          <div
            key={d.driver_id}
            className="flex items-center justify-between p-3 rounded-xl border border-neutral-200"
          >
            <div>
              <p className="font-medium text-neutral-800 text-sm">{d.nama}</p>
              <p className="text-xs text-neutral-400">
                Rute saat ini: {d.rute_assigned || "-"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${WARNA_STATUS[d.status]}`}
              >
                {LABEL_STATUS[d.status]}
              </span>

              <select
                defaultValue=""
                disabled={assigningId === d.driver_id}
                onChange={(e) => handleAssign(d.driver_id, e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-neutral-300 outline-none
                disabled:opacity-50"
              >
                <option value="" hidden>
                  Assign rute...
                </option>
                {dataRute.map((r, idx) => (
                  <option value={r.kode} key={idx}>
                    {r.kode.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManajemenDriver;