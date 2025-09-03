let handler = async (m, { conn, text }) => {
    let user = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!user) throw '❗ Tag a user or reply to their message to use this command.';

    let target = user.split('@')[0];
    let sender = m.sender.split('@')[0];

    let message = `*🔥 @${sender} is igniting passion with @${target}... 💋*`;

    await conn.reply(m.chat, message, m, { mentions: [user, m.sender] });

    await conn.sendMessage(m.chat, {
        react: {
            text: '💦',
            key: m.key
        }
    });
};

handler.customPrefix = /^\.scopa$/i;
handler.command = new RegExp;
export default handler;
