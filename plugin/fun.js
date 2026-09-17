const axios = require('axios')

module.exports = {
    joke: async (ctx) => {
        try {
            const res = await axios.get('https://official-joke-api.appspot.com/random_joke', { timeout: 10000 })
            await ctx.sendButton(`😂 ${res.data.setup}\n\n👉 ${res.data.punchline}`, [
                { text: '😂 Joke Lain', id: '.joke' },
                { text: '💬 Quote', id: '.quote' }
            ])
        } catch (e) {
            ctx.reply('❌ Gagal ambil joke.')
        }
    },
    dadu: async (ctx) => {
        const n = Math.floor(Math.random() * 6) + 1
        await ctx.sendButton(`🎲 Dadu: *${n}*`, [
            { text: '🎲 Lempar Lagi', id: '.dadu' },
            { text: '🪙 Coin', id: '.coin' }
        ])
    },
    coin: async (ctx) => {
        const result = Math.random() < 0.5 ? '🪙 *HEADS*' : '🪙 *TAILS*'
        await ctx.sendButton(result, [
            { text: '🪙 Lempar Lagi', id: '.coin' },
            { text: '🎲 Dadu', id: '.dadu' }
        ])
    },
    truth: async (ctx) => {
        const list = ['Siapa orang yang paling lo benci?', 'Apa rahasia terbesar lo?', 'Pernah bohong ke ortu?', 'Siapa crush lo sekarang?', 'Apa hal paling memalukan lo?']
        await ctx.sendButton(`❓ *TRUTH*\n${list[Math.floor(Math.random() * list.length)]}`, [
            { text: '❓ Truth Lagi', id: '.truth' },
            { text: '🔥 Dare', id: '.dare' }
        ])
    },
    dare: async (ctx) => {
        const list = ['Kirim voice note nyanyi lagu anak', 'Chat mantan lo sekarang', 'Kirim selfie jelek', 'Bilang "aku ganteng" 10x']
        await ctx.sendButton(`🔥 *DARE*\n${list[Math.floor(Math.random() * list.length)]}`, [
            { text: '🔥 Dare Lagi', id: '.dare' },
            { text: '❓ Truth', id: '.truth' }
        ])
    },
    rate: async (ctx) => {
        const n = Math.floor(Math.random() * 100) + 1
        await ctx.sendButton(`📊 Rate: *${n}/100*`, [
            { text: '🎯 Rate Lagi', id: '.rate' }
        ])
    },
    cekwibu: async (ctx) => {
        await ctx.sendButton(`🎌 Tingkat wibu: *${Math.floor(Math.random() * 100)}%*`, [
            { text: '🎌 Cek Lagi', id: '.cekwibu' }
        ])
    },
    cekganteng: async (ctx) => {
        await ctx.sendButton(`😎 Tingkat ganteng: *${Math.floor(Math.random() * 100)}%*`, [
            { text: '😎 Cek Lagi', id: '.cekganteng' }
        ])
    },
    cekcantik: async (ctx) => {
        await ctx.sendButton(`😍 Tingkat cantik: *${Math.floor(Math.random() * 100)}%*`, [
            { text: '😍 Cek Lagi', id: '.cekcantik' }
        ])
    },
    jodoh: async (ctx) => {
        await ctx.sendButton(`💕 Kecocokan: *${Math.floor(Math.random() * 100)}%*`, [
            { text: '💕 Cek Lagi', id: '.jodoh' }
        ])
    },
    slot: async (ctx) => {
        const e = ['🍎','🍌','🍇','🍒','🍉','⭐']
        const r = () => e[Math.floor(Math.random() * e.length)]
        const s = [r(), r(), r()]
        const menang = s[0] === s[1] && s[1] === s[2]
        await ctx.sendButton(`🎰 [ ${s.join(' | ')} ]\n\n${menang ? '🎉 JACKPOT!' : '😢 Coba lagi'}`, [
            { text: '🎰 Spin Lagi', id: '.slot' }
        ])
    },
    ball8: async (ctx) => {
        const list = ['Ya ✅','Tidak ❌','Mungkin 🤔','Coba lagi nanti ⏳','Tentu saja 💯','Gak mungkin 🚫','Tanya lagi 🔄']
        await ctx.sendButton(`🎱 ${list[Math.floor(Math.random() * list.length)]}`, [
            { text: '🎱 Tanya Lagi', id: '.ball8' }
        ])
    }
}
