let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid[0] || m.quoted?.sender || m.sender;

    if (!(who in global.db.data.users)) {
        return m.reply(`*The user is not present in the database.*`);
    }

    let user = global.db.data.users[who];
    
    // Safe initialization
    user.bank = Number(user.bank) || 0;

    let message = `${who === m.sender 
        ? `💰 𝐲𝐨𝐮 𝐡𝐚𝐯𝐞 *${user.bank} 💶 𝐮𝐧𝐢𝐭𝐲𝐜𝐨𝐢𝐧* 𝐢𝐧 𝐛𝐚𝐧𝐤🏛️.` 
        : `💰 𝐛𝐫𝐨 @${who.split('@')[0]} 𝐡𝐚𝐬 *${user.bank} 💶 𝐮𝐧𝐢𝐭𝐲𝐜𝐨𝐢𝐧* 𝐢𝐧 𝐛𝐚𝐧𝐤🏛️.`}`;

    await conn.sendMessage(m.chat, { 
        text: message,
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: 'ChatUnity'
            }
        }
    }, { quoted: m, detectLink: true });
};

handler.help = ['bank'];
handler.tags = ['rpg'];
handler.command = ['bank', 'banca'];
handler.register = true;
export default handler;
