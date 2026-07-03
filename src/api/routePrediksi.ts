import { useEffect, useState } from "react";
import axios from "axios";

const MODEL_API_URL = import.meta.env.VITE_MODEL_API_URL as string;

export interface PrediksiProps {
  hari: number;
  nama_hari: string;
  jam: number;
  estimasi_permintaan: number;
  level_kepadatan: "RENDAH" | "SEDANG" | "TINGGI" | "TUTUP";
  catatan?: string;
}

export const getPrediksiSekarang = async (): Promise<PrediksiProps | null> => {
  try {
    const res = await axios.get(`${MODEL_API_URL}/predict/now`);
    return res.data as PrediksiProps;
  } catch (error) {
    console.error("Gagal mengambil prediksi AI:", error);
    return null;
  }
};

export const getPrediksi = async (
  hari: number,
  jam: number,
): Promise<PrediksiProps | null> => {
  try {
    const res = await axios.get(`${MODEL_API_URL}/predict`, {
      params: { hari, jam },
    });
    return res.data as PrediksiProps;
  } catch (error) {
    console.error("Gagal mengambil prediksi AI:", error);
    return null;
  }
};

export const getPrediksiHeatmap = async (): Promise<PrediksiProps[]> => {
  try {
    const res = await axios.get(`${MODEL_API_URL}/predict/heatmap`);
    return res.data as PrediksiProps[];
  } catch (error) {
    console.error("Gagal mengambil data heatmap:", error);
    return [];
  }
};

export const usePrediksiSekarang = (intervalMs: number = 60000) => {
  const [prediksi, setPrediksi] = useState<PrediksiProps | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const data = await getPrediksiSekarang();
      if (isMounted) setPrediksi(data);
    };

    fetchData();
    const interval = setInterval(fetchData, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [intervalMs]);

  return prediksi;
};