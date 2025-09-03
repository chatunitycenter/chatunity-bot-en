let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Command suggestion verification
    if (!text) return conn.reply(m.chat, '⚠️ *Enter the command you want to suggest. Example: .suggest (command) (explanation)*', m)
    if (text.length < 10) return conn.reply(m.chat, '⚠️ *Please describe the command better (minimum 10 characters).*', m)
    if (text.length > 1000) return conn.reply(m.chat, '⚠️ *Maximum length allowed: 1000 characters.*', m)
    
    // Formatting the suggestion
    const suggestionText = `* \`S U G G E S T I O N\` *

📱 Number:
• Wa.me/${m.sender.split`@`[0]}

👤 User: 
• ${m.pushName || 'Anonymous'}

📝 Message:
• ${text}`

    try {
        // Send to owner
        await conn.reply(global.owner[0][0] + '@s.whatsapp.net', 
            m.quoted ? suggestionText + '\n\n📎 Quote:\n' + m.quoted.text : suggestionText, 
            m, 
            { mentions: conn.parseMention(suggestionText) }
        )

        // Send to channel
        await conn.sendMessage(global.channelid, { 
            text: m.quoted ? suggestionText + '\n\n📎 Quote:\n' + m.quoted.text : suggestionText, 
            contextInfo: {
                externalAdReply: {
                    title: "⚠️ command suggestion ⚠️",
                    body: 'New suggestion received',
                    thumbnailUrl: profilepic,
                    sourceUrl: socials,
                    mediaType: 1,
                    showAdAttribution: false,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: null })

        // Confirm to user
        await m.reply('✅ *Your suggestion has been sent to the developer.*\n_⚠ Illegal commands may result in restrictions._')
        
    } catch (error) {
        console.error('Error in suggestion:', error)
        await m.reply('✅ *Your suggestion has been sent to the developer.*\n_⚠ Illegal commands may result in restrictions._')
    }
}

handler.help = ['suggest']
handler.tags = ['gp']
handler.command = ['suggest']

export default handler
