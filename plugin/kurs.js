const axios = require('axios')
const settings = require('../settings')

const EX_BASE = settings.endpoints.exchangerate
const EX_KEY = settings.apiKeys.exchangerate

const getRates = async (base = 'USD') => {
    const res = await axios.get(`${EX_BASE}/${EX_KEY}/latest/${base}`, { timeout: 10000 })
    if (res.data.result !== 'success') throw new Error(res.data['error-type'] || 'API error')
    return res.data
}

module.exports = {
    kurs: async (ctx) => {
        try {
            if (ctx.args.length < 3) {
                return ctx.sendButton(
                    '💱 *KONVERSI MATA UANG*\n\nFormat: `.kurs <jumlah> <dari> <ke>`\n\nContoh cepat:',
                    [
                        { text: '💵 100 USD → IDR', id: '.kurs 100 USD IDR' },
                        { text: '💶 100 EUR → IDR', id: '.kurs 100 EUR IDR' },
                        { text: '💷 100 GBP → IDR', id: '.kurs 100 GBP IDR' },
                        { text: '🇯🇵 1000 JPY → IDR', id: '.kurs 1000 JPY IDR' }
                    ]
                )
            }
            const amount = parseFloat(ctx.args[0])
            const from = ctx.args[1].toUpperCase()
            const to = ctx.args[2].toUpperCase()
            if (isNaN(amount)) return ctx.reply('❌ Jumlah harus angka')
            const data = await getRates(from)
            const rate = data.conversion_rates[to]
            if (!rate) return ctx.reply(`❌ Kode "${to}" gak valid`)
            const result = amount * rate
            const updated = new Date(data.time_last_update_unix * 1000).toLocaleString('id-ID')

            await ctx.sendButton(
                `💱 *KONVERSI MATA UANG*\n\n` +
                `${amount.toLocaleString('id-ID')} ${from} = *${result.toLocaleString('id-ID', { maximumFractionDigits: 2 })} ${to}*\n\n` +
                `📊 Rate: 1 ${from} = ${rate.toLocaleString('id-ID', { maximumFractionDigits: 4 })} ${to}\n` +
                `🕐 Update: ${updated}`,
                [
                    { text: '🔄 Refresh', id: `.kurs ${amount} ${from} ${to}` },
                    { text: '📋 Semua Rate', id: `.rate ${from}` }
                ]
            )
        } catch (e) {
            console.error('kurs error:', e.message)
            ctx.reply('❌ Gagal konversi.')
        }
    },

    rate: async (ctx) => {
        try {
            const base = (ctx.args[0] || 'USD').toUpperCase()
            const data = await getRates(base)
            const rates = data.conversion_rates
            const populer = ['IDR', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'MYR', 'CNY', 'AUD', 'KRW']
            let text = `💵 *RATE ${base}*\n\n`
            populer.forEach(cur => {
                if (cur === base) return
                if (rates[cur]) text += `1 ${base} = ${rates[cur].toLocaleString('id-ID', { maximumFractionDigits: 4 })} ${cur}\n`
            })
            const updated = new Date(data.time_last_update_unix * 1000).toLocaleString('id-ID')
            text += `\n🕐 Update: ${updated}`

            await ctx.sendButton(text, [
                { text: '🇮🇩 Rate IDR', id: '.rate IDR' },
                { text: '🇺🇸 Rate USD', id: '.rate USD' },
                { text: '🇪🇺 Rate EUR', id: '.rate EUR' }
            ])
        } catch (e) {
            ctx.reply('❌ Gagal ambil rate.')
        }
    },

    cekmatauang: async (ctx) => {
        try {
            const data = await getRates('USD')
            const list = Object.keys(data.conversion_rates)
            ctx.reply(`💱 *DAFTAR MATA UANG* (${list.length} total)\n\n${list.join(', ')}`)
        } catch (e) {
            ctx.reply('❌ Gagal ambil daftar mata uang.')
        }
    }
}
