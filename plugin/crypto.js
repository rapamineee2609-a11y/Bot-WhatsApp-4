const axios = require('axios')
const settings = require('../settings')

const CG_BASE = settings.endpoints.coingecko
const CG_KEY = settings.apiKeys.coingecko

const cgGet = async (endpoint, params = {}) => {
    const res = await axios.get(`${CG_BASE}${endpoint}`, {
        params: { ...params, x_cg_demo_api_key: CG_KEY },
        timeout: 10000
    })
    return res.data
}

const formatUSD = (n) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
    return `$${n.toLocaleString('en-US', { maximumFractionDigits: 8 })}`
}

module.exports = {
    crypto: async (ctx) => {
        try {
            if (!ctx.args[0]) {
                return ctx.sendButton(
                    '💰 *CEK HARGA CRYPTO*\n\nPilih coin yang mau dicek:',
                    [
                        { text: '₿ Bitcoin', id: '.crypto bitcoin' },
                        { text: 'Ξ Ethereum', id: '.crypto ethereum' },
                        { text: '◎ Solana', id: '.crypto solana' },
                        { text: 'Ð Dogecoin', id: '.crypto dogecoin' }
                    ]
                )
            }
            const coin = ctx.args[0].toLowerCase()
            const data = await cgGet('/simple/price', {
                ids: coin,
                vs_currencies: 'usd,idr',
                include_24hr_change: true,
                include_market_cap: true,
                include_24hr_vol: true
            })
            if (!data[coin]) return ctx.reply(`❌ Coin "${coin}" gak ditemukan`)
            const d = data[coin]
            const change = d.usd_24h_change || 0
            const emoji = change >= 0 ? '📈' : '📉'
            const sign = change >= 0 ? '+' : ''

            await ctx.sendButton(
                `💰 *${coin.toUpperCase()}*\n\n` +
                `💵 USD: *$${d.usd.toLocaleString('en-US')}*\n` +
                `🇮🇩 IDR: *Rp${d.idr?.toLocaleString('id-ID') || '-'}*\n` +
                `${emoji} 24h: *${sign}${change.toFixed(2)}%*\n` +
                `📊 Market Cap: ${formatUSD(d.usd_market_cap || 0)}\n` +
                `📦 Volume 24h: ${formatUSD(d.usd_24h_vol || 0)}`,
                [
                    { text: '🔄 Refresh', id: `.crypto ${coin}` },
                    { text: '📊 Top 10', id: '.topcrypto' },
                    { text: '🔥 Trending', id: '.trending' }
                ]
            )
        } catch (e) {
            console.error('crypto error:', e.message)
            ctx.reply('❌ Gagal ambil data crypto.')
        }
    },

    topcrypto: async (ctx) => {
        try {
            const data = await cgGet('/coins/markets', {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            })
            let text = `🏆 *TOP 10 CRYPTO*\n\n`
            data.forEach((c, i) => {
                const change = c.price_change_percentage_24h || 0
                const emoji = change >= 0 ? '🟢' : '🔴'
                text += `${i + 1}. *${c.symbol.toUpperCase()}* — ${c.name}\n`
                text += `   💵 $${c.current_price.toLocaleString('en-US')}\n`
                text += `   ${emoji} ${change.toFixed(2)}%\n\n`
            })
            await ctx.sendButton(text.trim(), [
                { text: '🔥 Trending', id: '.trending' },
                { text: '🌐 Market', id: '.market' }
            ])
        } catch (e) {
            ctx.reply('❌ Gagal ambil data top crypto.')
        }
    },

    trending: async (ctx) => {
        try {
            const data = await cgGet('/search/trending')
            const coins = data.coins.slice(0, 7)
            let text = `🔥 *TRENDING CRYPTO*\n\n`
            coins.forEach((c, i) => {
                const item = c.item
                text += `${i + 1}. *${item.symbol}* — ${item.name}\n`
                text += `   Rank: #${item.market_cap_rank || '-'}\n\n`
            })
            await ctx.sendButton(text.trim(), [
                { text: '🏆 Top 10', id: '.topcrypto' },
                { text: '🌐 Market', id: '.market' }
            ])
        } catch (e) {
            ctx.reply('❌ Gagal ambil data trending.')
        }
    },

    market: async (ctx) => {
        try {
            const data = await cgGet('/global')
            const d = data.data
            await ctx.sendButton(
                `🌐 *GLOBAL CRYPTO MARKET*\n\n` +
                `💰 Total Market Cap: *${formatUSD(d.total_market_cap.usd)}*\n` +
                `📊 Volume 24h: ${formatUSD(d.total_volume.usd)}\n` +
                `₿ BTC Dominance: *${d.market_cap_percentage.btc.toFixed(2)}%*\n` +
                `Ξ ETH Dominance: ${d.market_cap_percentage.eth.toFixed(2)}%\n` +
                `🪙 Total Coins: ${d.active_cryptocurrencies.toLocaleString()}\n` +
                `📈 Change 24h: ${d.market_cap_change_percentage_24h_usd.toFixed(2)}%`,
                [
                    { text: '🏆 Top 10', id: '.topcrypto' },
                    { text: '🔥 Trending', id: '.trending' }
                ]
            )
        } catch (e) {
            ctx.reply('❌ Gagal ambil data market.')
        }
    }
}
