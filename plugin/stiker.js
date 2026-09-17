const { downloadMediaMessage } = require('@whiskeysockets/baileys')

module.exports = {
    sticker: async (ctx) => {
        const msg = ctx.m.message
        const quoted = msg.extendedTextMessage?.contextInfo?.quotedMessage
        const target = quoted || msg
        const type = Object.keys(target)[0]
        if (!['imageMessage', 'videoMessage'].includes(type)) return ctx.reply('Kirim/reply gambar/video!')
        const buffer = await downloadMediaMessage({ message: target, key: ctx.m.key }, 'buffer', {}, { logger: console, reuploadRequest: ctx.sock.updateMediaMessage })
        await ctx.sock.sendMessage(ctx.sender, { sticker: buffer }, { quoted: ctx.m })
    },
    stickurl: async (ctx) => {
        if (!ctx.args[0]) return ctx.reply('Contoh: .stickurl https://xxx.jpg')
        await ctx.sock.sendMessage(ctx.sender, { sticker: { url: ctx.args[0] } }, { quoted: ctx.m })
    }
}
