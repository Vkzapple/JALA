import axios from "axios";
import type { HalteProps } from "./routeHalte";

const API_URL = import.meta.env.VITE_API_URL as string;

export const RADIUS_ABSENSI_METER = 150;

export interface LokasiProps {
  lat: number;
  lon: number;
}

export interface HasilAbsensiProps {
  success: boolean;
  jarak_meter: number;
  message: string;
}

export const hitungJarakMeter = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371000; // radius bumi (meter)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const ambilLokasiSaatIni = (): Promise<LokasiProps> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Browser tidak mendukung Geolocation."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        reject(new Error(`Gagal mengambil lokasi: ${err.message}`));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
};

export const lakukanAbsensi = async (
  halteAwal: HalteProps,
): Promise<HasilAbsensiProps> => {
  try {
    const lokasi = await ambilLokasiSaatIni();

    const jarak = hitungJarakMeter(
      lokasi.lat,
      lokasi.lon,
      halteAwal.koordinat_x,
      halteAwal.koordinat_y,
    );

    const valid = jarak <= RADIUS_ABSENSI_METER;

    await axios.post(`${API_URL}/api/absensi`, {
      id_halte: halteAwal.nama_halte,
      lat: lokasi.lat,
      lon: lokasi.lon,
      jarak_meter: Math.round(jarak),
      status: valid ? "berhasil" : "gagal_diluar_radius",
    });

    if (valid) {
      return {
        success: true,
        jarak_meter: Math.round(jarak),
        message: `Absen berhasil! Jarak kamu ${Math.round(jarak)}m dari halte.`,
      };
    } else {
      return {
        success: false,
        jarak_meter: Math.round(jarak),
        message: `Absen gagal. Kamu berada ${Math.round(jarak)}m dari halte (maks. ${RADIUS_ABSENSI_METER}m).`,
      };
    }
  } catch (error) {
    return {
      success: false,
      jarak_meter: -1,
      message: error instanceof Error ? error.message : "Terjadi kesalahan.",
    };
  }
};