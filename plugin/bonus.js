const axios = require('axios')

const gen = (name, fn) => ({ [name]: fn })

module.exports = {
    ...gen('cat', async (ctx) => { ctx.sock.sendMessage(ctx.sender, { image: { url: 'https://cataas.com/cat' } }, { quoted: ctx.m }) }),
    ...gen('dog', async (ctx) => { const r = await axios.get('https://dog.ceo/api/breeds/image/random'); ctx.sock.sendMessage(ctx.sender, { image: { url: r.data.message } }, { quoted: ctx.m }) }),
    ...gen('fox', async (ctx) => { const r = await axios.get('https://randomfox.ca/floof/'); ctx.sock.sendMessage(ctx.sender, { image: { url: r.data.image } }, { quoted: ctx.m }) }),
    ...gen('pokemon', async (ctx) => { const id = Math.floor(Math.random()*898)+1; ctx.sock.sendMessage(ctx.sender, { image: { url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` }, caption: `Pokemon #${id}` }, { quoted: ctx.m }) }),
    ...gen('waifu', async (ctx) => { const r = await axios.get('https://api.waifu.pics/sfw/waifu'); ctx.sock.sendMessage(ctx.sender, { image: { url: r.data.url } }, { quoted: ctx.m }) }),
    ...gen('fakta', async (ctx) => { const r = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random'); ctx.reply(`🧠 ${r.data.text}`) }),
    ...gen('zodiak', async (ctx) => { const z = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']; ctx.reply(`♈ Zodiak: ${z[Math.floor(Math.random()*12)]}`) }),
    ...gen('password', async (ctx) => { ctx.reply(`🔐 Password: \`${Math.random().toString(36).slice(-12)}\``) }),
    ...gen('bucin', async (ctx) => { ctx.reply('💌 Bucin level: ' + Math.floor(Math.random()*100) + '%') }),
    ...gen('kaya', async (ctx) => { ctx.reply('💰 Kaya level: ' + Math.floor(Math.random()*100) + '%') }),
    ...gen('pinter', async (ctx) => { ctx.reply('🧠 Pinter level: ' + Math.floor(Math.random()*100) + '%') }),
    ...gen('sabar', async (ctx) => { ctx.reply('🧘 Sabar level: ' + Math.floor(Math.random()*100) + '%') }),
    ...gen('keren', async (ctx) => { ctx.reply('😎 Keren level: ' + Math.floor(Math.random()*100) + '%') }),
    ...gen('jomblo', async (ctx) => { ctx.reply('💔 Jomblo level: ' + Math.floor(Math.random()*100) + '%') })
}
