const axios = require('axios')
const moment = require('moment-timezone')
const settings = require('../settings')

module.exports = {
    menu: async (ctx) => {
        const sections = [
            {
                title: '🛠️ TOOLS & UTILITY',
                rows: [
                    { title: '💱 Kurs Mata Uang', description: 'Konversi USD, IDR, EUR, dll', rowId: '.kurs 100 USD IDR' },
                    { title: '🌤️ Cek Cuaca', description: 'Cuaca kota mana aja', rowId: '.weather Jakarta' },
                    { title: '🌐 Info IP', description: 'Cek lokasi IP', rowId: '.ip 8.8.8.8' },
                    { title: '🕐 Jam Sekarang', description: 'Waktu WIB', rowId: '.jam' },
                    { title: '🧮 Kalkulator', description: 'Hitung matematika', rowId: '.calc 5*10' }
                ]
            },
            {
                title: '💰 CRYPTO',
                rows: [
                    { title: '💵 Cek Harga Coin', description: 'Bitcoin, ETH, dll', rowId: '.crypto bitcoin' },
                    { title: '🏆 Top 10 Crypto', description: 'Ranking market cap', rowId: '.topcrypto' },
                    { title: '🔥 Trending Crypto', description: 'Coin yang lagi naik', rowId: '.trending' },
                    { title: '🌐 Global Market', description: 'Stats market global', rowId: '.market' }
                ]
            },
            {
                title: '🎮 FUN & GAMES',
                rows: [
                    { title: '💬 Random Quote', description: 'Quote motivasi', rowId: '.quote' },
                    { title: '😂 Joke', description: 'Lelucon random', rowId: '.joke' },
                    { title: '🎲 Dadu', description: 'Lempar dadu', rowId: '.dadu' },
                    { title: '🪙 Coin', description: 'Heads or tails', rowId: '.coin' },
                    { title: '❓ Truth or Dare', description: 'Main truth or dare', rowId: '.truth' },
                    { title: '🎰 Slot', description: 'Main slot', rowId: '.slot' }
                ]
            },
            {
                title: '🕌 ISLAMI',
                rows: [
                    { title: '🤲 Doa Random', description: 'Doa sehari-hari', rowId: '.doa' },
                    { title: '☪️ Asmaul Husna', description: '99 nama Allah', rowId: '.asmaulhusna' },
                    { title: '📖 Ayat Random', description: 'Ayat Al-Quran', rowId: '.ayat' },
                    { title: '🕌 Jadwal Sholat', description: 'Jadwal sholat kota', rowId: '.jadwalsholat Jakarta' }
                ]
            },
            {
                title: '📥 DOWNLOADER',
                rows: [
                    { title: '🎵 TikTok', description: 'Download TikTok', rowId: '.tiktok' },
                    { title: '🎧 YouTube MP3', description: 'Download audio YT', rowId: '.ytmp3' },
                    { title: '🎬 YouTube MP4', description: 'Download video YT', rowId: '.ytmp4' },
                    { title: '📷 Instagram', description: 'Download IG', rowId: '.ig' },
                    { title: '📘 Facebook', description: 'Download FB', rowId: '.fb' }
                ]
            },
            {
                title: '👥 GROUP',
                rows: [
                    { title: '📢 Tag All', description: 'Tag semua member', rowId: '.tagall' },
                    { title: '📋 Info Grup', description: 'Info grup ini', rowId: '.groupinfo' },
                    { title: '🔗 Link Grup', description: 'Link invite grup', rowId: '.linkgc' }
                ]
            },
            {
                title: '👑 OWNER',
                rows: [
                    { title: '📊 Runtime', description: 'Uptime bot', rowId: '.runtime' },
                    { title: 'ℹ️ Info Bot', description: 'Info bot', rowId: '.info' }
                ]
            }
        ]

        try {
            await ctx.sendList(
                `╭━━━「 *${settings.botName}* 」\n┃\n┃ 👋 Hai *${ctx.pushName}*!\n┃ Pilih menu di bawah ya 👇\n┃\n╰━━━━━━━━━━━━━━`,
                '📋 Buka Menu',
                sections
            )
        } catch (e) {
            await ctx.sendButton(
                `╭━━━「 *${settings.botName}* 」\n┃\n┃ 👋 Hai *${ctx.pushName}*!\n┃ Pilih kategori:\n╰━━━━━━━━━━━━━━`,
                [
                    { text: '🛠️ Tools', id: '.menu' },
                    { text: '💰 Crypto', id: '.topcrypto' },
                    { text: '🎮 Fun', id: '.quote' }
                ]
            )
        }
    },

    ping: async (ctx) => {
        const start = Date.now()
        await ctx.reply(`🏓 Pong! *${Date.now() - start}ms*`)
    },

    owner: async (ctx) => {
        ctx.reply(`👑 Owner: ${settings.owner.map(v => '@' + v).join(', ')}`)
    },

    weather: async (ctx) => {
        try {
            if (!ctx.args[0]) {
                return ctx.sendButton(
                    '🌤️ *CEK CUACA*\n\nMau cek cuaca kota mana?',
                    [
                        { text: '🏙️ Jakarta', id: '.weather Jakarta' },
                        { text: '🌆 Bandung', id: '.weather Bandung' },
                        { text: '🏝️ Bali', id: '.weather Denpasar' },
                        { text: '🌃 Surabaya', id: '.weather Surabaya' }
                    ]
                )
            }

            const city = ctx.args.join(' ')
            const geoRes = await axios.get(settings.endpoints.geocoding, {
                params: { name: city, count: 1, language: 'id', format: 'json' },
                timeout: 10000
            })
            if (!geoRes.data.results || geoRes.data.results.length === 0) {
                return ctx.reply(`❌ Kota "${city}" gak ditemukan`)
            }
            const loc = geoRes.data.results[0]
            const weatherRes = await axios.get(settings.endpoints.openmeteo, {
                params: {
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    current_weather: true,
                    hourly: 'temperature_2m,relativehumidity_2m,precipitation_probability',
                    timezone: 'auto',
                    forecast_days: 1
                },
                timeout: 10000
            })
            const w = weatherRes.data.current_weather
            const hourly = weatherRes.data.hourly
            const now = new Date()
            const idx = hourly.time.findIndex(t => new Date(t).getHours() === now.getHours())
            const humidity = idx >= 0 ? hourly.relativehumidity_2m[idx] : '-'
            const hujan = idx >= 0 ? hourly.precipitation_probability[idx] : '-'
            const weatherDesc = {
                0: '☀️ Cerah', 1: '🌤️ Cerah Berawan', 2: '⛅ Berawan', 3: '☁️ Mendung',
                45: '🌫️ Berkabut', 48: '🌫️ Kabut Tebal', 51: '🌦️ Gerimis Ringan',
                53: '🌦️ Gerimis', 55: '🌧️ Gerimis Lebat', 61: '🌧️ Hujan Ringan',
                63: '🌧️ Hujan Sedang', 65: '🌧️ Hujan Lebat', 71: '🌨️ Salju Ringan',
                80: '🌦️ Hujan Lokal', 95: '⛈️ Badai Petir', 99: '⛈️ Badai Petir Hebat'
            }
            const deskripsi = weatherDesc[w.weathercode] || '❓ Tidak diketahui'

            await ctx.sendButton(
                `🌍 *Cuaca ${loc.name}, ${loc.country}*\n\n` +
                `${deskripsi}\n` +
                `🌡️ Suhu: *${w.temperature}°C*\n` +
                `💨 Angin: ${w.windspeed} km/h\n` +
                `💧 Kelembapan: ${humidity}%\n` +
                `☔ Peluang Hujan: ${hujan}%\n\n` +
                `_Update: ${w.time}_`,
                [
                    { text: '🔄 Refresh', id: `.weather ${city}` },
                    { text: '🏙️ Ganti Kota', id: '.weather' }
                ]
            )
        } catch (e) {
            console.error('weather error:', e.message)
            ctx.reply('❌ Gagal ambil data cuaca.')
        }
    },

    calc: async (ctx) => {
        if (!ctx.args[0]) return ctx.reply('Contoh: .calc 5*10')
        try {
            const expr = ctx.args.join(' ').replace(/[^0-9+\-*/().]/g, '')
            const result = eval(expr)
            ctx.reply(`🧮 ${expr} = *${result}*`)
        } catch {
            ctx.reply('❌ Ekspresi salah!')
        }
    },

    translate: async (ctx) => {
        try {
            if (ctx.args.length < 2) return ctx.reply('Contoh: .translate en Halo dunia')
            const lang = ctx.args[0]
            const text = ctx.args.slice(1).join(' ')
            const res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|${lang}`, { timeout: 10000 })
            ctx.reply(`🌐 *Translate:*\n${res.data.responseData.translatedText}`)
        } catch (e) {
            ctx.reply('❌ Gagal translate.')
        }
    },

    jam: async (ctx) => {
        ctx.reply(`🕐 *Waktu Sekarang*\n${moment().tz('Asia/Jakarta').format('dddd, DD MMMM YYYY\nHH:mm:ss')} WIB`)
    },

    runtime: async (ctx) => {
        const uptime = process.uptime()
        const h = Math.floor(uptime / 3600)
        const m = Math.floor((uptime % 3600) / 60)
        const s = Math.floor(uptime % 60)
        ctx.reply(`⏱️ Runtime: ${h}j ${m}m ${s}s`)
    },

    b64enc: async (ctx) => {
        if (!ctx.args[0]) return ctx.reply('Contoh: .b64enc Halo')
        ctx.reply(Buffer.from(ctx.args.join(' ')).toString('base64'))
    },

    b64dec: async (ctx) => {
        if (!ctx.args[0]) return ctx.reply('Contoh: .b64dec SGFsbw==')
        try { ctx.reply(Buffer.from(ctx.args[0], 'base64').toString()) }
        catch { ctx.reply('❌ Format salah') }
    },

    info: async (ctx) => {
        ctx.reply(`🤖 *Info Bot*\nNama: ${settings.botName}\nPrefix: ${settings.prefix.join(' ')}\nRuntime: ${Math.floor(process.uptime())}s`)
    }
}
