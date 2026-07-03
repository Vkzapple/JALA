import type { Data } from "../components/feature/RoutesElem";
import type { HalteProps, PenumpangProps } from "./routeHalte";

import routeData from "../data/v1.json";
import halteData from "../data/halte.json";
import penumpangData from "../data/penumpang.json";

const data: Data[] = routeData as Data[];
const halte: HalteProps[] = halteData as HalteProps[];
const penumpang: PenumpangProps[] = penumpangData as PenumpangProps[];
export interface MapProps {
  halte1: HalteProps;
  halte2: HalteProps;
}

export interface RouteData {
  coordinates: [number, number][];
  duration: number; // seconds
  distance: number; // meters
}
export const routeHandlerAPI = (b: string) => {
  const dataPassed: Data = data.filter((a) => a.kode == b)[0];

  const jurusanAwal: string = dataPassed.jurusan.split(" - ")[0];
  const jurusanAkhir: string = dataPassed.jurusan.split(" - ")[1];

  const halteAwal = halte.filter(
    (a) => a.nama_halte.toLowerCase() == jurusanAwal.toLowerCase(),
  );
  const halteAkhir = halte.filter(
    (a) => a.nama_halte.toLowerCase() == jurusanAkhir.toLowerCase(),
  );

  const passengers = penumpang.filter((a) => a.kode_trayek == b);
  let passengerTotal = 0;
  passengers.map((a) => {
    passengerTotal += a.jumlah_penumpang;
  });
  console.log(passengerTotal);
  const passenger: PenumpangProps = passengers[passengers.length - 1];
  if (passenger) {
    passenger.jumlah_penumpang = passengerTotal;
    console.log(passenger);
  }
  const objResult = {
    data_passed: dataPassed,
    halte_awal: halteAwal[halteAwal.length - 1],
    halte_akhir: halteAkhir[halteAkhir.length - 1],
    passenger: passenger,
  };
  return objResult;
};

export const processMap = (halte1: string, halte2: string) => {
  const halteAwal = halte.filter(
    (a) => a.nama_halte.toLowerCase() == halte1.toLowerCase(),
  );
  const halteAkhir = halte.filter(
    (a) => a.nama_halte.toLowerCase() == halte2.toLowerCase(),
  );
  const data = {
    halteAwal,
    halteAkhir,
  };
  return data;
};

export const countZoomValue = (
  selisihX: number,
  selisihY: number,
  height: number,
) => {
  const selisihMax = Math.max(Math.abs(selisihX), Math.abs(selisihY));

  const zoom = Math.log2((360 * height) / (selisihMax * 256));

  const result = Math.floor(zoom) - 1;

  console.log(result);

  return Math.min(Math.max(result, 1), 18);
};

export const formatDuration = (seconds: number) => {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
};

export const formatDistance = (meters: number) => {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};

export const fetchRoutes = async (start: HalteProps, end: HalteProps) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.koordinat_y},${start.koordinat_x};${end.koordinat_y},${end.koordinat_x}?overview=full&geometries=geojson&alternatives=true`,
    );
    const data = await response.json();

    if (data.routes?.length > 0) {
      const routeData: RouteData[] = data.routes.map(
        (route: {
          geometry: { coordinates: [number, number][] };
          duration: number;
          distance: number;
        }) => ({
          coordinates: route.geometry.coordinates,
          duration: route.duration,
          distance: route.distance,
        }),
      );
      return routeData;
    }
  } catch (error) {
    console.error("Failed to fetch routes:", error);
  }
};
