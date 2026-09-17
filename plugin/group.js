module.exports = {
    kick: async (ctx) => {
        if (!ctx.isGroup) return ctx.reply('Khusus grup!')
        if (!ctx.isOwner) return ctx.reply('Khusus owner!')
        const target = ctx.m.message.extendedTextMessage?.contextInfo?.participant
        if (!target) return ctx.reply('Reply target!')
        await ctx.sock.groupParticipantsUpdate(ctx.sender, [target], 'remove')
        await ctx.sendButton('✅ Berhasil kick', [{ text: '📋 Info Grup', id: '.groupinfo' }])
    },
    add: async (ctx) => {
        if (!ctx.isGroup) return ctx.reply('Khusus grup!')
        if (!ctx.isOwner) return ctx.reply('Khusus owner!')
        if (!ctx.args[0]) return ctx.reply('Contoh: .add 628xxx')
        await ctx.sock.groupParticipantsUpdate(ctx.sender, [`${ctx.args[0]}@s.whatsapp.net`], 'add')
        await ctx.sendButton('✅ Berhasil add', [{ text: '📋 Info Grup', id: '.groupinfo' }])
    },
    promote: async (ctx) => {
        if (!ctx.isGroup) return ctx.reply('Khusus grup!')
        if (!ctx.isOwner) return ctx.reply('Khusus owner!')
        const target = ctx.m.message.extendedTextMessage?.contextInfo?.participant
        if (!target) return ctx.reply('Reply target!')
        await ctx.sock.groupParticipantsUpdate(ctx.sender, [target], 'promote')
        await ctx.sendButton('✅ Berhasil promote', [{ text: '📋 Info Grup', id: '.groupinfo' }])
    },
    demote: async (ctx) => {
        if (!ctx.isGroup) return ctx.reply('Khusus grup!')
        if (!ctx.isOwner) return ctx.reply('Khusus owner!')
        const target = ctx.m.message.extendedTextMessage?.contextInfo?.participant
        if (!target) return ctx.reply('Reply target!')
        await ctx.sock.groupParticipantsUpdate(ctx.sender, [target], 'demote')
        await ctx.sendButton('✅ Berhasil demote', [{ text: '📋 Info Grup', id: '.groupinfo' }])
    },
    tagall: async (ctx) => {
        if (!ctx.isGroup) return ctx.reply('Khusus grup!')
        const meta = await ctx.sock.groupMetadata(ctx.sender)
        const mentions = meta.participants.map(p => p.id)
        const text = `📢 *${ctx.args.join(' ') || 'PENGUMUMAN'}*\n\n` + mentions.map(m => `@${m.split('@')[0]}`).join(' ')
        await ctx.sock.sendMessage(ctx.sender, { text, mentions }, { quoted: ctx.m })
    },
    groupinfo: async (ctx) => {
        if (!ctx.isGroup) return ctx.reply('Khusus grup!')
        const meta = await ctx.sock.groupMetadata(ctx.sender)
        await ctx.sendButton(
            `📋 *Info Grup*\n\nNama: ${meta.subject}\nID: ${meta.id}\nDibuat: ${new Date(meta.creation * 1000).toLocaleString()}\nMember: ${meta.participants.length}`,
            [
                { text: '🔗 Link GC', id: '.linkgc' },
                { text: '📢 Tag All', id: '.tagall' }
            ]
        )
    },
    linkgc: async (ctx) => {
        if (!ctx.isGroup) return ctx.reply('Khusus grup!')
        const code = await ctx.sock.groupInviteCode(ctx.sender)
        await ctx.sendButton(`🔗 https://chat.whatsapp.com/${code}`, [{ text: '📋 Info Grup', id: '.groupinfo' }])
    },
    leave: async (ctx) => {
        if (!ctx.isGroup) return ctx.reply('Khusus grup!')
        await ctx.reply('👋 Bye!')
        await ctx.sock.groupLeave(ctx.sender)
    },
    setname: async (ctx) => {
        if (!ctx.isGroup) return ctx.reply('Khusus grup!')
        if (!ctx.isOwner) return ctx.reply('Owner only!')
        await ctx.sock.groupUpdateSubject(ctx.sender, ctx.args.join(' '))
        ctx.reply('✅ Nama grup diubah')
    },
    setdesc: async (ctx) => {
        if (!ctx.isGroup) return ctx.reply('Khusus grup!')
        if (!ctx.isOwner) return ctx.reply('Owner only!')
        await ctx.sock.groupUpdateDescription(ctx.sender, ctx.args.join(' '))
        ctx.reply('✅ Deskripsi diubah')
    }
}
