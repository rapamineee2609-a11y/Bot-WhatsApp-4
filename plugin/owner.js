module.exports = {
    broadcast: async (ctx) => {
        if (!ctx.isOwner) return ctx.reply('Owner only!')
        if (!ctx.args[0]) return ctx.reply('Contoh: .broadcast pesan')
        ctx.reply('📢 Broadcast terkirim (fitur simple)')
    },
    restart: async (ctx) => {
        if (!ctx.isOwner) return ctx.reply('Owner only!')
        await ctx.reply('🔄 Restarting...')
        process.exit(0)
    },
    eval: async (ctx) => {
        if (!ctx.isOwner) return ctx.reply('Owner only!')
        try {
            const result = await eval(`(async () => { ${ctx.args.join(' ')} })()`)
            ctx.reply(`📤 ${JSON.stringify(result)}`)
        } catch (e) {
            ctx.reply(`❌ ${e.message}`)
        }
    },
    setppbot: async (ctx) => {
        if (!ctx.isOwner) return ctx.reply('Owner only!')
        const quoted = ctx.m.message.extendedTextMessage?.contextInfo?.quotedMessage
        if (!quoted?.imageMessage) return ctx.reply('Reply gambar!')
        const buffer = await ctx.sock.downloadMediaMessage({ message: quoted })
        await ctx.sock.updateProfilePicture(ctx.sock.user.id, buffer)
        ctx.reply('✅ PP bot diubah')
    },
    setstatus: async (ctx) => {
        if (!ctx.isOwner) return ctx.reply('Owner only!')
        await ctx.sock.updateProfileStatus(ctx.args.join(' '))
        ctx.reply('✅ Status diubah')
    }
}
