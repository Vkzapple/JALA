import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

export interface StatusHalteProps {
  ada_penumpang: boolean;
  waktu: number | null;
}

export type StatusMapProps = Record<string, StatusHalteProps>;

export const getStatusPenumpang = async (): Promise<StatusMapProps> => {
  try {
    const res = await axios.get(`${API_URL}/api/status`);
    return res.data as StatusMapProps;
  } catch (error) {
    console.error("Gagal mengambil status penumpang:", error);
    return {};
  }
};

export const useStatusPenumpang = (intervalMs: number = 3000) => {
  const [statusMap, setStatusMap] = useState<StatusMapProps>({});

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      const data = await getStatusPenumpang();
      if (isMounted) {
        setStatusMap(data);
      }
    };

    fetchStatus(); 
    const interval = setInterval(fetchStatus, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [intervalMs]);

  return statusMap;
};

// helper: cek halte tertentu (by nama_halte)
export const cekAdaPenumpang = (
  statusMap: StatusMapProps,
  namaHalte: string | undefined,
): boolean => {
  if (!namaHalte) return false;

  const match = Object.keys(statusMap).find(
    (id) => id.toLowerCase() === namaHalte.toLowerCase(),
  );

  if (!match) return false;
  return statusMap[match].ada_penumpang;
};
