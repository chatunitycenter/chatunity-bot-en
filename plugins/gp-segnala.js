let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, '⚠ *Enter the command you want to report.*', m)
    if (text.length < 10) return conn.reply(m.chat, '⚠️ *Describe the problem better (minimum 10 characters).*', m)
    if (text.length > 1000) return conn.reply(m.chat, '⚠️ *Maximum allowed length: 1000 characters.*', m)
    
    const reportText = `*❌️ \`R E P O R T\` ❌️*

📱 Number:
• Wa.me/${m.sender.split`@`[0]}

👤 User: 
• ${m.pushName || 'Anonymous'}

📝 Message:
• ${text}`

    try {
        await conn.reply(global.owner[0][0] + '@s.whatsapp.net', 
            m.quoted ? reportText + '\n\n📎 Quoted message:\n' + m.quoted.text : reportText, 
            m, 
            { mentions: conn.parseMention(reportText) }
        )

        await conn.sendMessage(global.channelid, { 
            text: m.quoted ? reportText + '\n\n📎 Quoted message:\n' + m.quoted.text : reportText, 
            contextInfo: {
                externalAdReply: {
                    title: "⚠️ BUG REPORT ⚠️",
                    body: 'New report received',
                    thumbnailUrl: fotoperfil,
                    sourceUrl: redes,
                    mediaType: 1,
                    showAdAttribution: false,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: null })

        await m.reply('✅ *Your report has been sent to the developer.*\n_⚠ False reports may result in restrictions._')
        
    } catch (error) {
        console.error('Error sending report:', error)
        await m.reply('✅ *Your report has been sent to the developer.*\n_⚠ False reports may result in restrictions._')
    }
}

handler.help = ['report']
handler.tags = ['info']
handler.command = ['report', 'bug', 'error', 'reporta',]

export default handler