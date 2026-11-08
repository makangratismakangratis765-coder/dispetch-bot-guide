// Bot DISPETCH minimal
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/^\/start$/, async (m) => {
  await bot.sendMessage(m.chat.id, "Halo! Bot aktif", {
    reply_markup: {
      inline_keyboard: [[
        { text: "Tekan", callback_data: "ok", style: "success" }
      ]]
    }
  });
});

bot.on("callback_query", async (q) => {
  await bot.answerCallbackQuery(q.id, { text: "Mantap!" });
});

(async () => {
  const me = await bot.getMe();
  await bot.setMyCommands([{ command: "start", description: "Menu utama" }]);
  console.log("Bot siap sebagai", me.username);
})();
