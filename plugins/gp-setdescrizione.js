const handler = async (m, { conn, args }) => {
    try {

        const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => './menu/chatunitybot.mp4');

        const description = args.join(' ').trim();

        if (!description) {
            return conn.reply(m.chat, 'Please enter a valid group description.', m);
        }

        await conn.groupUpdateDescription(m.chat, description);

        await conn.reply(m.chat, '✅ *Group description updated successfully!*', m);

    } catch (error) {
        console.error('Error updating group description:', error);
        conn.reply(m.chat, '❌ *An error occurred while updating the description.*', m);
    }
}

handler.help = ['setdesc <text>'];
handler.tags = ['group'];
handler.command = /^setdesk|setdesc(rizione)?|descrip(ción|cion)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;