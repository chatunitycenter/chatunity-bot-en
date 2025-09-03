// credits: Onix, by Riad
let handler = async (m, { conn, text }) => {
    let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;

    // Check if the target user is the bot's number
    if (who === conn.user.jid) {
        await conn.sendMessage(m.chat, { 
            text: `🚫 Unable to get the bot's profile photo.` 
        }, { quoted: m });
        return;
    }

    try {
        // Retrieve the user's profile picture (if available)
        let profilePicture = await conn.profilePictureUrl(who, 'image');
        await conn.sendMessage(m.chat, { 
            image: { url: profilePicture }, 
            caption: `📸` 
        }, { quoted: m, mentions: [who] });
    } catch (e) {
        // User has no profile photo or it's not available
        await conn.sendMessage(m.chat, { 
            text: `@${who.split('@')[0]} does not have a profile photo 🚫`, 
            mentions: [who] 
        }, { quoted: m })
    }
};

handler.command = /^(pic)$/i;
handler.group = true;
handler.admin = true;
export default handler;
