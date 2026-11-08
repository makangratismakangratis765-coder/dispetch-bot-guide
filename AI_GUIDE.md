# AI Cheat Sheet - DISPETCH Bot

## Aturan Mutlak

```
File tunggal ESM
import TelegramBot from "node-telegram-bot-api"
new TelegramBot(TOKEN, { polling: true })
TOKEN dari runtime, jangan hardcode
Bungkus API call dengan ok() / try-catch
Data persisten -> bot.storage

JANGAN:
- process.exit()
- express / server HTTP
- setWebHook / webhook
- file_id reuse (upload ulang via URL)
- dynamic import()
```

## Template Siap Pakai

```js
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(TOKEN, { polling: true });
const ok = (p) => p.catch((e) => { console.error(e?.message); return null; });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

bot.onText(/^\/start$/, async (m) => {
  await ok(bot.sendMessage(m.chat.id, "Pilih menu:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Info", callback_data: "info", style: "primary" }],
        [{ text: "Bantuan", callback_data: "help", style: "success" }],
      ]
    }
  }));
});

bot.on("callback_query", async (q) => {
  if (q.data === "info") {
    await ok(bot.answerCallbackQuery(q.id));
    await ok(bot.editMessageText("Ini info.", {
      chat_id: q.message.chat.id,
      message_id: q.message.message_id
    }));
  } else if (q.data === "help") {
    await ok(bot.answerCallbackQuery(q.id, { text: "Alert!", show_alert: true }));
  }
});

(async () => {
  const me = await bot.getMe();
  await ok(bot.setMyCommands([{ command: "start", description: "Menu utama" }]));
  console.log("Siap:", me.username);
})();
```

## Fitur DISPETCH Only

| Fitur | Cara Pakai |
|---|---|
| Warna tombol | `style:"success"` / `"primary"` / `"danger"` |
| Link internal | `url:"dispetch://u/<id>"` |
| Emoji kustom | `"{ce:ID}"` |
| Emoji animasi | `"{ce:ID=true}"` |
| Teks salin | backtick di halaman rich |
| Storage | `await bot.storage.set(k,v)` |
| Tabel | `{k:"t", r:[[...]]}` |
| Lipat | `{k:"cl", x:"Judul", c:[...], o:false}` |

## Batas

- Rate limit: 100 panggilan / 10 detik
- HTTP: 60 req/menit, host privat ditolak
- Media: max 25 MB
- Storage: 2 MB
- setMyCommands: max 40
- Watchdog: stop kalau loop lebih dari 25-30 detik

## Error Umum

| Error | Solusi |
|---|---|
| message text is empty | Kasih teks valid |
| message is too long | Pecah di atas 4096 char |
| message is not modified | Cek dulu sebelum edit |
| 501 Not Implemented | Method tidak ada |
| 429 Too Many Requests | Tunggu retry_after detik |
