let handler = async (m, { conn, text, participants, command, usedPrefix }) => {
    // If no one is mentioned, check if the message is a reply
    if (!text) {
        if (m.quoted && m.quoted.sender) {
            text = '@' + m.quoted.sender.split('@')[0];
        } else {
            return conn.reply(m.chat, ` You need to mention someone or reply to a message to kiss them💋! Example: ${usedPrefix + command} @user`, m);
        }
    }

    // Get users mentioned in the message
    let mentionedUsers = m.mentionedJid;

    // If no mentions and it's a reply, use the quoted message sender
    if (!mentionedUsers.length && m.quoted && m.quoted.sender) {
        mentionedUsers = [m.quoted.sender];
    }

    // If still no one to kiss
    if (!mentionedUsers.length) {
        return m.reply("💋 *You need to mention someone to kiss them!*\nExample: *.kiss @user*");
    }

    let kissedUser = mentionedUsers[0];

    // Kiss message
    let message = `💋 *${await conn.getName(m.sender)} kissed ${await conn.getName(kissedUser)}!* 😘`;

    await conn.sendMessage(m.chat, { text: message, mentions: [kissedUser] }, { quoted: m });
};

handler.command = ["kiss"];
export default handler;
