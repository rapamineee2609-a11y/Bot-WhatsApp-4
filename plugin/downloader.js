const axios = require('axios')

module.exports = {
    tiktok: async (ctx) => {
        if (!ctx.args[0]) {
            return ctx.sendButton(
                '📥 *TIKTOK DOWNLOADER*\n\nKirim link TikTok dengan format:\n`.tiktok <link>`',
                [
                    { text: '📥 TikTok', id: '.tiktok' },
                    { text: '🎧 YouTube MP3', id: '.ytmp3' }
                ]
            )
        }
        try {
            const res = await axios.get(`https://www.tikwm.com/api/?url=${ctx.args[0]}`, { timeout: 30000 })
            if (!res.data.data) return ctx.reply('❌ Gagal download')
            const v = res.data.data
            await ctx.sock.sendMessage(ctx.sender, { video: { url: v.play }, caption: `📥 ${v.title || 'TikTok Video'}` }, { quoted: ctx.m })
        } catch (e) {
            ctx.reply('❌ Gagal download TikTok.')
        }
    },
    ytmp3: async (ctx) => {
        if (!ctx.args[0]) return ctx.reply('Contoh: .ytmp3 https://youtu.be/xxx')
        try {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/ytmp3?url=${ctx.args[0]}`, { timeout: 30000 })
            if (!res.data.url) return ctx.reply('❌ Gagal')
            await ctx.sock.sendMessage(ctx.sender, { audio: { url: res.data.url }, mimetype: 'audio/mpeg' }, { quoted: ctx.m })
        } catch (e) {
            ctx.reply('❌ Gagal download YTMP3.')
        }
    },
    ytmp4: async (ctx) => {
        if (!ctx.args[0]) return ctx.reply('Contoh: .ytmp4 https://youtu.be/xxx')
        try {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/ytmp4?url=${ctx.args[0]}`, { timeout: 30000 })
            if (!res.data.url) return ctx.reply('❌ Gagal')
            await ctx.sock.sendMessage(ctx.sender, { video: { url: res.data.url }, caption: `📥 ${res.data.title}` }, { quoted: ctx.m })
        } catch (e) {
            ctx.reply('❌ Gagal download YTMP4.')
        }
    },
    ig: async (ctx) => {
        if (!ctx.args[0]) return ctx.reply('Contoh: .ig https://instagram.com/p/xxx')
        try {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/igdl?url=${ctx.args[0]}`, { timeout: 30000 })
            for (const item of res.data.data || []) {
                await ctx.sock.sendMessage(ctx.sender, { video: { url: item.url } }, { quoted: ctx.m })
            }
        } catch (e) {
            ctx.reply('❌ Gagal download IG.')
        }
    },
    fb: async (ctx) => {
        if (!ctx.args[0]) return ctx.reply('Contoh: .fb https://facebook.com/xxx')
        try {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/fbdl?url=${ctx.args[0]}`, { timeout: 30000 })
            if (!res.data.url) return ctx.reply('❌ Gagal')
            await ctx.sock.sendMessage(ctx.sender, { video: { url: res.data.url } }, { quoted: ctx.m })
        } catch (e) {
            ctx.reply('❌ Gagal download FB.')
        }
    }
}
