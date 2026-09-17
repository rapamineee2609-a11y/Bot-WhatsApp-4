const axios = require('axios')
const settings = require('../settings')

module.exports = {
    quote: async (ctx) => {
        try {
            const res = await axios.get(settings.endpoints.zenquotes, { timeout: 10000 })
            const q = res.data[0]
            await ctx.sendButton(`💬 _"${q.q}"_\n\n— *${q.a}*`, [
                { text: '💬 Quote Lain', id: '.quote' },
                { text: '😂 Joke', id: '.joke' }
            ])
        } catch (e) {
            console.error('quote error:', e.message)
            ctx.reply('❌ Gagal ambil quote.')
        }
    }
}
