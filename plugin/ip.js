const axios = require('axios')
const settings = require('../settings')

const IP_API = settings.endpoints.ipapi

module.exports = {
    ip: async (ctx) => {
        try {
            if (!ctx.args[0]) {
                return ctx.sendButton(
                    '🌐 *CEK INFO IP*\n\nKirim IP dengan format:\n`.ip <ip-address>`\n\nContoh:',
                    [
                        { text: '🌐 Google DNS', id: '.ip 8.8.8.8' },
                        { text: '🌐 Cloudflare', id: '.ip 1.1.1.1' },
                        { text: '🖥️ IP Server', id: '.myip' }
                    ]
                )
            }
            const target = ctx.args[0]
            const url = `${IP_API}/${target}`
            const res = await axios.get(url, {
                params: { fields: 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query' },
                timeout: 10000
            })
            const d = res.data
            if (d.status === 'fail') return ctx.reply(`❌ Gagal: ${d.message || 'IP tidak valid'}`)

            await ctx.sendButton(
                `🌐 *INFO IP*\n\n` +
                `🔍 IP: *${d.query}*\n` +
                `🌍 Negara: ${d.country} (${d.countryCode})\n` +
                `🗺️ Region: ${d.regionName}\n` +
                `🏙️ Kota: ${d.city || '-'}\n` +
                `📮 Kode Pos: ${d.zip || '-'}\n` +
                `📍 Koordinat: ${d.lat}, ${d.lon}\n` +
                `🕐 Timezone: ${d.timezone}\n` +
                `📡 ISP: ${d.isp || '-'}\n` +
                `🏢 Org: ${d.org || '-'}\n` +
                `🔢 AS: ${d.as || '-'}`,
                [
                    { text: '🔄 Refresh', id: `.ip ${target}` },
                    { text: '🖥️ IP Server', id: '.myip' }
                ]
            )
        } catch (e) {
            ctx.reply('❌ Gagal ambil info IP.')
        }
    },

    myip: async (ctx) => {
        try {
            const res = await axios.get(IP_API, {
                params: { fields: 'status,country,regionName,city,timezone,isp,org,as,query' },
                timeout: 10000
            })
            const d = res.data
            if (d.status === 'fail') return ctx.reply('❌ Gagal ambil IP server')

            await ctx.sendButton(
                `🖥️ *IP SERVER BOT*\n\n` +
                `🔍 IP: *${d.query}*\n` +
                `🌍 Negara: ${d.country}\n` +
                `🏙️ Kota: ${d.city}\n` +
                `🕐 Timezone: ${d.timezone}\n` +
                `📡 ISP: ${d.isp}\n` +
                `🏢 Org: ${d.org}`,
                [
                    { text: '🔄 Refresh', id: '.myip' }
                ]
            )
        } catch (e) {
            ctx.reply('❌ Gagal ambil IP server.')
        }
    }
}
