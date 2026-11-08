# Instruksi untuk AI

Repo ini adalah panduan bikin bot untuk aplikasi DISPETCH (messenger Android bergaya Telegram).

WAJIB baca sebelum menulis kode bot:
1. AI_GUIDE.md (aturan mutlak + template)
2. README.md (detail method, batas, fitur khas DISPETCH)

Ringkas: file tunggal ESM, token dari variabel TOKEN, tanpa process.exit/express/webhook, media hanya via URL, data persisten pakai bot.storage, bungkus API call dengan ok().

Contoh siap pakai: bot-minimal.js dan bot-utility.js.
