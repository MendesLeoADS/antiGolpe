const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

require("dotenv").config();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = process.env.PORT || 8088;

app.post("/send-location", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: "Latitude e longitude são obrigatórias." });
  }

  try {
    // Envia a localização como um ponto interativo no Telegram
    const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendLocation`, {
      chat_id: TELEGRAM_CHAT_ID,
      latitude: latitude,
      longitude: longitude
    });

    if (response.data.ok) {
      res.status(200).json({ success: true });
    } else {
      throw new Error(response.data.description || "Erro na API do Telegram");
    }
  } catch (error) {
    console.error("Erro ao enviar localização:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/webhook", async (req, res) => {
  const update = req.body;
  console.log("Recebido do Telegram:", update);

  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: `Você disse: ${text}`,
    });
  }

  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});