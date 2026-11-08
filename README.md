# DISPETCH Bot Guide

Panduan bikin bot untuk aplikasi DISPETCH (messenger Android bergaya Telegram).

## TL;DR buat AI

7 aturan emas:

1. File tunggal JavaScript ESM
2. Token dari variabel `TOKEN` runtime, jangan hardcode
3. Jangan pakai `process.exit()`, `express`, webhook
4. Media hanya via URL (http/https atau data:base64), `file_id` belum bisa dipakai ulang
5. Bungkus semua API call dengan `ok()` atau try-catch
6. Data persisten pakai `bot.storage`
7. Ragu method didukung? Panggil aja, tangani error 501

## Kerangka Minimal

```js
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/^\/start$/, async (m) => {
  await bot.sendMessage(m.chat.id, "Halo!", {
    reply_markup: {
      inline_keyboard: [[{ text: "Tekan", callback_data: "x", style: "success" }]]
    }
  });
});

bot.on("callback_query", async (q) => {
  await bot.answerCallbackQuery(q.id, { text: "OK" });
});

(async () => {
  const me = await bot.getMe();
  await bot.setMyCommands([{ command: "start", description: "Menu utama" }]);
  console.log("siap sebagai", me.username);
})();
```

## Cara Pakai

1. Buka aplikasi DISPETCH
2. Menu Bot, lalu Buat Bot Baru
3. Ambil token (otomatis)
4. Tempel kode bot di editor
5. Simpan, bot langsung jalan

## Modul Tersedia

| Modul | Status |
|---|---|
| node-telegram-bot-api | Full |
| fs, path, crypto, buffer, util, events | Full |
| axios, node-fetch, fetch | Full (60 req/menit) |
| express, cors, dotenv | Stub (tidak ada server) |
| zlib, stream, tls | Tidak tersedia |

Pakai static import: `import x from "x"`. Jangan dynamic `await import("x")`.

## Method yang Didukung

**Pesan:** sendMessage, editMessageText, editMessageReplyMarkup, editMessageCaption, deleteMessage, deleteMessages, forwardMessage(s), copyMessage(s), sendChatAction

**Media (URL only):** sendPhoto, sendVideo, sendAnimation, sendAudio, sendVoice, sendDocument, sendSticker, sendVideoNote, sendMediaGroup

**Lain:** sendLocation, sendVenue, sendContact, sendPoll, sendDice, stopPoll

**Chat:** getChat, getChatMember, getChatAdministrators, getChatMemberCount, pinChatMessage, unpinChatMessage, unpinAllChatMessages, leaveChat, banChatMember, unbanChatMember, restrictChatMember, promoteChatMember, setChatTitle, setChatDescription, setChatPermissions

**Bot:** getMe, setMyCommands (max 40), getMyCommands, deleteMyCommands, answerCallbackQuery

**Tidak didukung:** webhook, mode inline, file_id reuse, answerCallbackQuery.url. Method lain akan return 501.

## Fitur Khas DISPETCH

Warna tombol: tambah `style` di tombol inline: `"primary"`, `"success"`, `"danger"`.

```js
{ text: "BELI", callback_data: "buy", style: "success" }
```

- Link internal: `url: "dispetch://u/<id_user>"`
- Emoji kustom: `{ce:ID}` di teks
- Emoji animasi: `{ce:ID=true}`

### Halaman rich JSON

Teks bisa berupa JSON `{"v":2,"b":[blok...]}` dengan blok:

- `h` heading
- `p` paragraf
- `t` tabel (`r`: baris sel)
- `d` pemisah
- `ft` footer
- `cl` bagian lipat (`x` judul, `c` anak, `o` terbuka)

Teks dalam backtick = diketuk untuk disalin. Format beda tampil: `tampil|salin`.

### Storage persisten

```js
await bot.storage.set("kunci", { a: 1 });
const v = await bot.storage.get("kunci");
await bot.storage.delete("kunci");
const keys = await bot.storage.keys("prefix:");
```

## Perbedaan dari Telegram

| Hal | DISPETCH |
|---|---|
| Rate limit | 100 panggilan / 10 detik (429) |
| HTTP keluar | 60 req/menit, host privat ditolak |
| Media | Max 25 MB, file_id belum bisa dipakai ulang |
| Storage | 2 MB |
| Method tidak dikenal | 501 |
| Webhook | Tidak ada |
| Mode inline | Tidak ada |

## Pola Wajib

```js
const ok = (p) => p.catch((e) => {
  console.error("ERR", e?.response?.body ?? e?.message);
  return null;
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
```

Bungkus semua panggilan API dengan `ok()`. Jangan loop sinkron panjang.

## Checklist AI

1. ESM, `import TelegramBot from "node-telegram-bot-api"`, `new TelegramBot(TOKEN, { polling: true })`
2. Tidak pakai process.exit, express, webhook, mode inline
3. Media hanya URL, jangan andalkan file_id
4. Perintah huruf kecil, setMyCommands maksimal 40
5. Tangani error tiap panggilan, hormati rate limit
6. Data persisten pakai bot.storage
7. Ragu method didukung? Panggil dan tangani 501

## Berkas

- README.md : dokumen ini
- AI_GUIDE.md : cheat sheet ringkas
- bot-minimal.js : starter 20 baris
- bot-utility.js : contoh bot utilitas
