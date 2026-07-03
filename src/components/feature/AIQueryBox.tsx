import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, BarChart3 } from "lucide-react";
import { tanyaAI, type GrafikPendukungProps } from "../../api/routeOps";

interface QueryEntry {
  pertanyaan: string;
  jawaban: string;
  grafik: GrafikPendukungProps | null;
}

const CONTOH_PERTANYAAN = [
  "Rute mana yang paling sering terlambat hari ini?",
  "Driver mana yang keluar jalur minggu ini?",
  "Kalau saya pindahkan 1 armada dari Koridor 8N ke 9D, apa dampaknya?",
];

const MiniBarChart = ({ grafik }: { grafik: GrafikPendukungProps }) => {
  const max = Math.max(...grafik.data.map((d) => d.value), 1);
  return (
    <div className="mt-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
      <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-neutral-500">
        <BarChart3 className="size-3.5" />
        {grafik.judul}
      </div>
      <div className="flex flex-col gap-1.5">
        {grafik.data.map((d, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs w-28 truncate text-neutral-600">{d.label}</span>
            <div className="flex-1 bg-neutral-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-700 h-full rounded-full"
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
            <span className="text-xs w-6 text-right text-neutral-500">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AIQueryBox = () => {
  const [riwayat, setRiwayat] = useState<QueryEntry[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [riwayat, loading]);

  const kirimPertanyaan = async (teks: string) => {
    const pertanyaan = teks.trim();
    if (!pertanyaan || loading) return;

    setInput("");
    setLoading(true);

    const hasil = await tanyaAI(pertanyaan);

    setRiwayat((prev) => [
      ...prev,
      {
        pertanyaan,
        jawaban: hasil?.reply ?? "Maaf, AI sedang tidak bisa dihubungi. Pastikan backend & model_api.py berjalan.",
        grafik: hasil?.grafik_pendukung ?? null,
      },
    ]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") kirimPertanyaan(input);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="size-5 text-blue-800" />
        <p className="font-bold text-lg text-blue-800">Tanyakan ke AI</p>
      </div>
      <p className="text-xs text-neutral-400 mb-4">
        Ajukan pertanyaan bebas soal kondisi operasional - AI menjawab berdasarkan data real sistem.
      </p>

      {riwayat.length === 0 && !loading && (
        <div className="flex flex-wrap gap-2 mb-4">
          {CONTOH_PERTANYAAN.map((c, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => kirimPertanyaan(c)}
              className="text-xs px-3 py-2 rounded-full border border-neutral-200 text-neutral-500
              hover:border-blue-300 hover:text-blue-700 transition-colors text-left"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {riwayat.length > 0 && (
        <div className="flex flex-col gap-4 mb-4 max-h-96 overflow-y-auto pr-1">
          {riwayat.map((r, idx) => (
            <div key={idx}>
              <p className="text-sm font-medium text-neutral-700 bg-neutral-100 rounded-xl px-3 py-2 self-end inline-block mb-2">
                {r.pertanyaan}
              </p>
              <div className="flex gap-2">
                <div className="p-1.5 rounded-full bg-blue-800 h-fit shrink-0">
                  <Sparkles className="size-3 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-700 leading-relaxed">{r.jawaban}</p>
                  {r.grafik && <MiniBarChart grafik={r.grafik} />}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="p-1.5 rounded-full bg-blue-800 h-fit shrink-0">
                <Sparkles className="size-3 text-white animate-pulse" />
              </div>
              <p className="text-sm text-neutral-400">AI sedang menganalisis data...</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan ke AI... contoh: rute mana paling sering telat?"
          className="flex-1 px-4 py-2.5 rounded-full border border-neutral-300 outline-none
          focus:border-blue-800 text-sm transition-colors"
        />
        <button
          type="button"
          onClick={() => kirimPertanyaan(input)}
          disabled={loading}
          className="p-2.5 rounded-full bg-blue-800 text-white
          disabled:opacity-50 hover:opacity-90 active:scale-95 transition-all"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default AIQueryBox;