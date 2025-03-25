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

// Endpoint de teste
app.get("/test", (req, res) => {
  console.log("Requisição GET recebida em /test");
  res.status(200).json({ success: true, message: "API funcionando!" });
});

// Endpoint para enviar localização
app.post("/send-location", async (req, res) => {
  console.log("Requisição POST recebida em /send-location:", req.body);

  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    console.log("Erro: Latitude e longitude não fornecidas");
    return res.status(400).json({ success: false, message: "Latitude e longitude são obrigatórias." });
  }

  try {
    const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendLocation`, {
      chat_id: TELEGRAM_CHAT_ID,
      latitude: latitude,
      longitude: longitude,
    });
    console.log("Resposta do Telegram:", response.data);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar localização:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint para o webhook do Telegram
app.post("/webhook", async (req, res) => {
  console.log("Webhook recebido:", req.body);
  const update = req.body;

  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: `Você disse: ${text}`,
      });
      console.log("Resposta enviada ao Telegram!");
    } catch (error) {
      console.error("Erro ao responder no Telegram:", error.message);
    }
  }

  res.status(200).json({ success: true });
});

module.exports = app;