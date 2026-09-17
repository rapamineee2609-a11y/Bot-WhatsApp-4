const axios = require('axios')
const settings = require('../settings')

const EQURAN = settings.endpoints.equran

module.exports = {
    doa: async (ctx) => {
        try {
            const res = await axios.get(`${EQURAN}/doa`, { timeout: 10000 })
            const data = res.data.data
            const d = data[Math.floor(Math.random() * data.length)]
            await ctx.sendButton(
                `🤲 *${d.nama}*\n\n${d.ar}\n\n_${d.tr}_\n\nArtinya: ${d.idn}`,
                [
                    { text: '🔄 Doa Lain', id: '.doa' },
                    { text: '☪️ Asmaul Husna', id: '.asmaulhusna' }
                ]
            )
        } catch (e) {
            ctx.reply('❌ Gagal ambil doa.')
        }
    },

    asmaulhusna: async (ctx) => {
        try {
            const res = await axios.get(`${EQURAN}/asmaulhusna`, { timeout: 10000 })
            const data = res.data.data
            const d = data[Math.floor(Math.random() * data.length)]
            await ctx.sendButton(
                `☪️ *${d.latin}* (${d.arab})\n\nArtinya: ${d.indo}`,
                [
                    { text: '🔄 Nama Lain', id: '.asmaulhusna' },
                    { text: '🤲 Doa', id: '.doa' }
                ]
            )
        } catch (e) {
            ctx.reply('❌ Gagal ambil asmaul husna.')
        }
    },

    niatsholat: async (ctx) => {
        const niat = {
            subuh: 'Usholli fardhos subhi rok\'ataini mustaqbilal qiblati adaa-an lillahi ta\'ala',
            dzuhur: 'Usholli fardhod dzuhri arba\'a roka\'atin mustaqbilal qiblati adaa-an lillahi ta\'ala',
            ashar: 'Usholli fardhol ashri arba\'a roka\'atin mustaqbilal qiblati adaa-an lillahi ta\'ala',
            maghrib: 'Usholli fardhol maghribi tsalatsa roka\'atin mustaqbilal qiblati adaa-an lillahi ta\'ala',
            isya: 'Usholli fardhol isya\'i arba\'a roka\'atin mustaqbilal qiblati adaa-an lillahi ta\'ala'
        }
        const key = ctx.args[0]?.toLowerCase()
        if (!niat[key]) {
            return ctx.sendButton(
                '🕌 *NIAT SHOLAT*\n\nPilih sholat:',
                [
                    { text: '🌅 Subuh', id: '.niatsholat subuh' },
                    { text: '☀️ Dzuhur', id: '.niatsholat dzuhur' },
                    { text: '🌤️ Ashar', id: '.niatsholat ashar' },
                    { text: '🌆 Maghrib', id: '.niatsholat maghrib' },
                    { text: '🌙 Isya', id: '.niatsholat isya' }
                ]
            )
        }
        await ctx.sendButton(`🕌 *Niat Sholat ${key}*\n\n${niat[key]}`, [
            { text: '🕌 Jadwal Sholat', id: '.jadwalsholat Jakarta' }
        ])
    },

    ayat: async (ctx) => {
        try {
            const res = await axios.get(`${EQURAN}/surat`, { timeout: 10000 })
            const suratList = res.data.data
            const surat = suratList[Math.floor(Math.random() * suratList.length)]
            const detail = await axios.get(`${EQURAN}/surat/${surat.nomor}`, { timeout: 10000 })
            const d = detail.data.data
            const ayat = d.ayat[Math.floor(Math.random() * d.ayat.length)]
            await ctx.sendButton(
                `📖 *QS. ${d.namaLatin} : ${ayat.nomorAyat}*\n\n${ayat.teksArab}\n\n_${ayat.teksLatin}_\n\nArtinya: ${ayat.teksIndonesia}`,
                [
                    { text: '🔄 Ayat Lain', id: '.ayat' },
                    { text: '🤲 Doa', id: '.doa' }
                ]
            )
        } catch (e) {
            ctx.reply('❌ Gagal ambil ayat.')
        }
    },

    jadwalsholat: async (ctx) => {
        try {
            const provinsi = ctx.args.join(' ') || 'DKI Jakarta'
            const provRes = await axios.get(`${EQURAN}/shalat/provinsi`, { timeout: 10000 })
            const provList = provRes.data.data
            const match = provList.find(p => p.toLowerCase() === provinsi.toLowerCase())
            if (!match) return ctx.reply(`❌ Provinsi gak ditemukan. Contoh: .jadwalsholat DKI Jakarta`)
            const kabRes = await axios.post(`${EQURAN}/shalat/kabkota`, { provinsi: match }, { timeout: 10000 })
            const kabList = kabRes.data.data
            const jadwalRes = await axios.post(`${EQURAN}/shalat`, {
                provinsi: match,
                kabkota: kabList[0],
                bulan: new Date().getMonth() + 1,
                tahun: new Date().getFullYear()
            }, { timeout: 10000 })
            const jadwal = jadwalRes.data.data.jadwal
            const now = new Date()
            const hariIni = jadwal.find(j => new Date(j.tanggal_lengkap).getDate() === now.getDate()) || jadwal[0]

            await ctx.sendButton(
                `🕌 *Jadwal Sholat ${kabList[0]}*\n\n` +
                `Imsak: ${hariIni.imsak}\n` +
                `Subuh: ${hariIni.subuh}\n` +
                `Dzuhur: ${hariIni.dzuhur}\n` +
                `Ashar: ${hariIni.ashar}\n` +
                `Maghrib: ${hariIni.maghrib}\n` +
                `Isya: ${hariIni.isya}`,
                [
                    { text: '🔄 Refresh', id: `.jadwalsholat ${provinsi}` },
                    { text: '🕌 Niat Sholat', id: '.niatsholat subuh' }
                ]
            )
        } catch (e) {
            ctx.reply('❌ Gagal ambil jadwal sholat.')
        }
    }
}
