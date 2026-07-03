import axios from "axios";
import halteData from "../data/halte.json";
import type { HalteProps } from "./routeHalte";
import { getStatusPenumpang } from "./routePenumpang";

const API_URL = import.meta.env.VITE_API_URL as string;

const halteList: HalteProps[] = halteData as HalteProps[];

export interface HalteAktifProps extends HalteProps {
  waktu: number;
}

export interface AbsensiRecordProps {
  id_halte: string;
  lat: number;
  lon: number;
  jarak_meter: number;
  status: string;
  waktu: number;
}

export const getHalteAktif = async (): Promise<HalteAktifProps[]> => {
  const statusMap = await getStatusPenumpang();

  const hasil: HalteAktifProps[] = [];

  for (const [idHalte, status] of Object.entries(statusMap)) {
    if (!status.ada_penumpang) continue;

    const halteMatch = halteList.find(
      (h) => h.nama_halte.toLowerCase() === idHalte.toLowerCase(),
    );

    if (halteMatch && status.waktu) {
      hasil.push({ ...halteMatch, waktu: status.waktu });
    }
  }

  return hasil;
};

// ====== Manajemen Driver ======
export type AiStatusDriver = "normal" | "delay" | "out_of_route" | "idle" | "emergency" | "offline";

export interface DriverProps {
  driver_id: string;
  nama: string;
  rute_assigned: string | null;
  status: "idle" | "menuju_halte" | "dalam_perjalanan" | "emergency" | "offline";
  last_update: number;
  lat?: number | null;
  lon?: number | null;
  speed_kmh?: number;
  ai_status?: AiStatusDriver;
  deviation_meter?: number;
  passenger_count?: number;
  eta_menit?: number | null;
}

export const getHistoriAbsensi = async (): Promise<AbsensiRecordProps[]> => {
  try {
    const res = await axios.get(`${API_URL}/api/absensi`);
    return (res.data as AbsensiRecordProps[]).reverse(); 
  } catch (error) {
    console.error("Gagal mengambil histori absensi:", error);
    return [];
  }
};

export const checkinDriver = async (
  driverId: string,
  nama: string,
  rute: string | undefined,
  status: string,
  lokasi?: { lat: number; lon: number },
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/api/driver/checkin`, {
      driver_id: driverId,
      nama,
      rute,
      status,
      lat: lokasi?.lat,
      lon: lokasi?.lon,
    });
  } catch (error) {
    console.error("Gagal check-in driver:", error);
  }
};

export const kirimStatusDarurat = async (driverId: string, aktif: boolean): Promise<boolean> => {
  try {
    await axios.post(`${API_URL}/api/driver/emergency`, { driver_id: driverId, aktif });
    return true;
  } catch (error) {
    console.error("Gagal mengirim status darurat:", error);
    return false;
  }
};

export const getDaftarDriver = async (): Promise<DriverProps[]> => {
  try {
    const res = await axios.get(`${API_URL}/api/driver/list`);
    return res.data as DriverProps[];
  } catch (error) {
    console.error("Gagal mengambil daftar driver:", error);
    return [];
  }
};

export const assignRuteDriver = async (
  driverId: string,
  rute: string,
): Promise<boolean> => {
  try {
    await axios.post(`${API_URL}/api/driver/assign`, {
      driver_id: driverId,
      rute,
    });
    return true;
  } catch (error) {
    console.error("Gagal assign rute:", error);
    return false;
  }
};

// ====== AI mendeteksi posisi driver -> sarankan rute (Dashboard Driver) ======
export interface RuteDisarankanProps {
  kode: string;
  jurusan: string;
}

export interface SaranRuteResponseProps {
  halte_terdekat: string | null;
  jarak_meter: number;
  dalam_radius: boolean;
  rute_disarankan: RuteDisarankanProps[];
  pesan: string;
}

export const mintaSaranRute = async (
  lat: number,
  lon: number,
): Promise<SaranRuteResponseProps | null> => {
  try {
    const res = await axios.post(`${API_URL}/api/driver/suggest-rute`, { lat, lon });
    return res.data as SaranRuteResponseProps;
  } catch (error) {
    console.error("Gagal meminta saran rute AI:", error);
    return null;
  }
};

// ====== Fleet Status (Dashboard Pengelola) ======
export interface FleetStatusProps {
  running: number;
  idle: number;
  emergency: number;
  offline: number;
  total: number;
}

export const getFleetStatus = async (): Promise<FleetStatusProps> => {
  try {
    const res = await axios.get(`${API_URL}/api/fleet-status`);
    return res.data as FleetStatusProps;
  } catch (error) {
    console.error("Gagal mengambil fleet status:", error);
    return { running: 0, idle: 0, emergency: 0, offline: 0, total: 0 };
  }
};

// ====== KPI ringkas (Dashboard Pengelola) ======
export interface KpiProps {
  driver_aktif: number;
  on_time_percent: number;
  alert_count: number;
  rute_aktif: number;
  ai_accuracy_percent: number;
  catatan: string;
}

export const getKpi = async (): Promise<KpiProps | null> => {
  try {
    const res = await axios.get(`${API_URL}/api/kpi`);
    return res.data as KpiProps;
  } catch (error) {
    console.error("Gagal mengambil KPI:", error);
    return null;
  }
};

// ====== Natural Language AI Query (AI Command Center) ======
export interface GrafikPendukungProps {
  judul: string;
  data: { label: string; value: number }[];
}

export interface AiQueryResponseProps {
  reply: string;
  grafik_pendukung: GrafikPendukungProps | null;
}

export const tanyaAI = async (pertanyaan: string): Promise<AiQueryResponseProps | null> => {
  try {
    const res = await axios.post(`${API_URL}/api/ai-query`, { pertanyaan });
    return res.data as AiQueryResponseProps;
  } catch (error) {
    console.error("Gagal menanyakan AI:", error);
    return null;
  }
};

export interface RekomendasiItemProps {
  prioritas: "TINGGI" | "SEDANG" | "RENDAH";
  pesan: string;
}

export interface RekomendasiResponseProps {
  prediksi_ai: {
    nama_hari: string;
    jam: number;
    estimasi_permintaan: number;
    level_kepadatan: string;
  };
  jumlah_halte_aktif: number;
  rekomendasi: RekomendasiItemProps[];
  catatan: string;
}

export const getRekomendasi = async (): Promise<RekomendasiResponseProps | null> => {
  try {
    const res = await axios.get(`${API_URL}/api/rekomendasi`);
    return res.data as RekomendasiResponseProps;
  } catch (error) {
    console.error("Gagal mengambil rekomendasi:", error);
    return null;
  }
};