const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  const update = req.body;
  console.log("Webhook recebido:", update);

  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    try {
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
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
};