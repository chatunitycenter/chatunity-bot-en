let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Get the bot name
    let botName = global.db.data.botname || `ChatUnity`

    // Only if the command is "open" (ignore arguments)
    if (command === 'open') {
        // Try to change group settings
        try {
            await conn.groupSettingUpdate(m.chat, 'not_announcement');
            await conn.sendMessage(m.chat, {
                text: 'Chat opened for everyone',
                contextInfo: {
                    forwardingScore: 99,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363259442839354@newsletter',
                        serverMessageId: '',
                        newsletterName: `${botName}`
                    }
                }
            }, { quoted: m });
        } catch (e) {
            await m.reply('❌ I cannot change settings: make sure I am an admin!');
        }
    }
}

handler.help = ['open'];
handler.tags = ['group'];
handler.command = /^open$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler
