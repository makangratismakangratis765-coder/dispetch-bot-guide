// Bot DISPETCH contoh: utilitas (waktu, kalkulator, info, salin)
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(TOKEN, { polling: true });
const ok = (p) => p.catch((e) => { console.error("ERR", e?.message); return null; });

const MENU = {
  inline_keyboard: [
    [{ text: "Waktu", callback_data: "waktu", style: "primary" }],
    [{ text: "Kalkulator", callback_data: "kalk", style: "primary" }],
    [{ text: "Info Bot", callback_data: "info", style: "success" }],
  ],
};

const BACK = {
  inline_keyboard: [[{ text: "Kembali", callback_data: "start", style: "primary" }]],
};

const waktuWIB = () =>
  new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

bot.onText(/^\/start$/, async (m) => {
  await ok(bot.sendMessage(m.chat.id, "Bot Utilitas\nPilih menu:", {
    reply_markup: MENU,
  }));
});

bot.onText(/^\/waktu$/, async (m) => {
  await ok(bot.sendMessage(m.chat.id, `Waktu sekarang:\n\`${waktuWIB()}\``));
});

bot.onText(/^\/kalk\s+(.+)$/, async (m, match) => {
  try {
    const expr = match[1].replace(/[^0-9+\-*/(). ]/g, "");
    if (!expr.trim()) throw new Error("kosong");
    const result = Function(`"use strict"; return (${expr})`)();
    await ok(bot.sendMessage(m.chat.id, `${expr} = \`${result}\``));
  } catch {
    await ok(bot.sendMessage(m.chat.id, "Contoh: /kalk 2+3*4"));
  }
});

bot.onText(/^\/info$/, async (m) => {
  const me = await ok(bot.getMe());
  await ok(bot.sendMessage(m.chat.id, [
    "Info Bot",
    `Nama: ${me?.first_name || "-"}`,
    `Username: @${me?.username || "-"}`,
    `ID: \`${me?.id || "-"}\``,
  ].join("\n")));
});

bot.onText(/^\/salin\s+(.+)$/, async (m, match) => {
  await ok(bot.sendMessage(m.chat.id, `Ketuk untuk salin:\n\`${match[1]}\``));
});

bot.on("callback_query", async (q) => {
  try {
    const chat_id = q.message.chat.id;
    const message_id = q.message.message_id;

    if (q.data === "waktu") {
      await ok(bot.answerCallbackQuery(q.id));
      await ok(bot.editMessageText(`Waktu: ${waktuWIB()}`, {
        chat_id, message_id, reply_markup: BACK,
      }));
    } else if (q.data === "kalk") {
      await ok(bot.answerCallbackQuery(q.id));
      await ok(bot.editMessageText("Kirim /kalk <ekspresi>\nContoh: /kalk 2+3*4", {
        chat_id, message_id, reply_markup: BACK,
      }));
    } else if (q.data === "info") {
      await ok(bot.answerCallbackQuery(q.id, { text: "Ketik /info", show_alert: true }));
    } else if (q.data === "start") {
      await ok(bot.answerCallbackQuery(q.id));
      await ok(bot.sendMessage(chat_id, "Menu utama:", { reply_markup: MENU }));
    }
  } catch (e) {
    console.error("cb:", e?.message);
  }
});

(async () => {
  const me = await ok(bot.getMe());
  await ok(bot.setMyCommands([
    { command: "start", description: "Menu utama" },
    { command: "waktu", description: "Cek waktu" },
    { command: "kalk", description: "Kalkulator" },
    { command: "info", description: "Info bot" },
    { command: "salin", description: "Salin teks" },
  ]));
  console.log("Bot utilitas siap:", me?.username);
})();
