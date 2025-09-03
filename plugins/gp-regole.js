let handler = async function (m, { conn, text, usedPrefix }) {
    let chat = global.db.data.chats[m.chat];
    if (!chat.rules || chat.rules === '') {
        throw `ⓘ The group admins have not set any rules yet.\n\n📌 To set the rules, use *${usedPrefix}setrules* followed by the rules text.`;
    }

    await conn.sendMessage(m.chat, { 
        text: `📜 *Group Rules*\n\n${chat.rules}`,
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: 'ChatUnity'
            }
        }
    }, { quoted: m });
};

handler.help = ['rules'];
handler.tags = ['group'];
handler.command = ['rules', 'regole'];
handler.admin = true;
export default handler;
