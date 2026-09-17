const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const pino = require('pino')
const fs = require('fs')
const path = require('path')
const settings = require('./settings')

let plugins = {}
const pluginFolder = path.join(__dirname, 'plugins')

// Load semua plugin
fs.readdirSync(pluginFolder).forEach(file => {
    if (!file.endsWith('.js')) return
    try {
        const plugin = require(`./plugins/${file}`)
        Object.assign(plugins, plugin)
        console.log(`✅ Loaded: ${file}`)
    } catch (e) {
        console.error(`❌ Gagal load ${file}:`, e.message)
    }
})

// ===== HELPER: KIRIM BUTTON =====
async function sendButton(sock, jid, text, buttons = [], footer = '', quoted = null) {
    try {
        if (!settings.useButton || buttons.length === 0) {
            let fallback = text
            if (buttons.length > 0) {
                fallback += '\n\n' + buttons.map((b, i) => `${i + 1}. ${b.text}`).join('\n')
            }
            return sock.sendMessage(jid, { text: fallback }, { quoted })
        }

        const buttonMessage = {
            text: text,
            footer: footer || settings.buttonFooter,
            buttons: buttons.map((b, i) => ({
                buttonId: b.id || `btn_${i}`,
                buttonText: { displayText: b.text },
                type: 1
            })),
            headerType: 1
        }
        return await sock.sendMessage(jid, buttonMessage, { quoted })
    } catch (e) {
        console.error('Button error:', e.message)
        let fallback = text
        if (buttons.length > 0) {
            fallback += '\n\n' + buttons.map((b, i) => `${i + 1}. ${b.text}`).join('\n')
        }
        return sock.sendMessage(jid, { text: fallback }, { quoted })
    }
}

// ===== HELPER: KIRIM LIST =====
async function sendList(sock, jid, text, buttonText, sections, footer = '', quoted = null) {
    try {
        if (!settings.useButton) {
            let fallback = text + '\n\n'
            sections.forEach(s => {
                fallback += `*${s.title}*\n`
                s.rows.forEach(r => { fallback += `• ${r.title}\n` })
                fallback += '\n'
            })
            return sock.sendMessage(jid, { text: fallback }, { quoted })
        }

        const listMessage = {
            text: text,
            footer: footer || settings.buttonFooter,
            title: '',
            buttonText: buttonText || 'Buka Menu',
            sections: sections
        }
        return await sock.sendMessage(jid, listMessage, { quoted })
    } catch (e) {
        console.error('List error:', e.message)
        let fallback = text + '\n\n'
        sections.forEach(s => {
            fallback += `*${s.title}*\n`
            s.rows.forEach(r => { fallback += `• ${r.title}\n` })
            fallback += '\n'
        })
        return sock.sendMessage(jid, { text: fallback }, { quoted })
    }
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !settings.pairing,
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        syncFullHistory: false,
        markOnlineOnConnect: true
    })

    if (settings.pairing && !sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(settings.phoneNumber)
                console.log(`🔑 Pairing Code: ${code}`)
            } catch (e) {
                console.error('Pairing error:', e.message)
            }
        }, 3000)
    }

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut
            console.log(`❌ Connection closed. Reconnect: ${shouldReconnect}`)
            if (shouldReconnect) startBot()
            else console.log('⚠️ Logged out. Hapus folder session & scan ulang.')
        } else if (connection === 'open') {
            console.log('✅ Bot Connected!')
        }
    })

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return
        const m = messages[0]
        if (!m.message || m.key.fromMe) return
        if (m.key.remoteJid === 'status@broadcast') return

        const sender = m.key.remoteJid
        const isGroup = sender.endsWith('@g.us')
        const senderNumber = isGroup ? m.key.participant : sender
        const pushName = m.pushName || 'User'

        const msgType = Object.keys(m.message)[0]
        let body = ''
        if (msgType === 'conversation') body = m.message.conversation
        else if (msgType === 'extendedTextMessage') body = m.message.extendedTextMessage.text
        else if (msgType === 'imageMessage') body = m.message.imageMessage.caption || ''
        else if (msgType === 'videoMessage') body = m.message.videoMessage.caption || ''
        else if (msgType === 'buttonsResponseMessage') body = m.message.buttonsResponseMessage.selectedButtonId
        else if (msgType === 'listResponseMessage') body = m.message.listResponseMessage.singleSelectReply.selectedRowId
        else if (msgType === 'templateButtonReplyMessage') body = m.message.templateButtonReplyMessage.selectedId

        if (!body) return

        const prefix = settings.prefix.find(p => body.startsWith(p))
        if (!prefix) return

        const args = body.slice(prefix.length).trim().split(/ +/)
        const command = args.shift().toLowerCase()
        const isOwner = settings.owner.includes(senderNumber.split('@')[0].replace(/[^0-9]/g, ''))

        const ctx = {
            sock, m, sender, senderNumber, isGroup, isOwner,
            body, args, command, pushName, prefix,
            settings,
            reply: (text) => sock.sendMessage(sender, { text }, { quoted: m }),
            sendButton: (text, buttons, footer) => sendButton(sock, sender, text, buttons, footer, m),
            sendList: (text, btnText, sections, footer) => sendList(sock, sender, text, btnText, sections, footer, m)
        }

        if (plugins[command]) {
            try {
                await plugins[command](ctx)
            } catch (e) {
                console.error(`❌ Error di .${command}:`, e.message)
                ctx.reply(`❌ Error: ${e.message}`)
            }
        }
    })
}

process.on('uncaughtException', (e) => {
    console.error('Uncaught Exception:', e.message)
})
process.on('unhandledRejection', (e) => {
    console.error('Unhandled Rejection:', e?.message || e)
})

startBot()
