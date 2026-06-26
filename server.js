const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const DURASI_AKTIF_DETIK = 30;

const statusHalte = {};

app.post("/api/trigger", (req, res) => {
  const { id_halte } = req.body;

  if (!id_halte) {
    return res.status(400).json({ error: "id_halte wajib diisi" });
  }

  statusHalte[id_halte] = {
    ada_penumpang: true,
    waktu: Date.now(),
  };

  console.log(`[TRIGGER] Ada penumpang di ${id_halte} pada ${new Date().toLocaleTimeString()}`);

  res.json({ success: true, id_halte, status: statusHalte[id_halte] });
});

app.get("/api/status", (req, res) => {
  const now = Date.now();
  for (const id in statusHalte) {
    const sudahLewat = now - statusHalte[id].waktu > DURASI_AKTIF_DETIK * 1000;
    if (sudahLewat) {
      statusHalte[id].ada_penumpang = false;
    }
  }

  res.json(statusHalte);
});

app.get("/api/status/:id_halte", (req, res) => {
  const { id_halte } = req.params;
  const data = statusHalte[id_halte] || { ada_penumpang: false, waktu: null };
  res.json(data);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`JALA backend jalan di http://0.0.0.0:${PORT}`);
  console.log("Cek IP laptop kamu (ipconfig/ifconfig) supaya ESP32 bisa connect ke server ini.");
});
