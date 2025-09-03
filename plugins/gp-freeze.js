import fetch from 'node-fetch';

const handler = async (m, { conn, command, text, isAdmin }) => {
    if (!isAdmin) throw 'Command available only for admins🌟';

    if (command === 'freeze') {
        const muteDuration = parseInt(text) || 10; // Duration in minutes, default 10 minutes
        const mentionedJid = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!mentionedJid) throw 'Missing tag❗︎';

        const user = global.db.data.users[mentionedJid] || {};
        if (user.muted) throw '⚠︎ User already muted ⚠︎';

        user.muted = true;

        // Mute notification
        const muteMessage = {
            text: `User @${mentionedJid.split('@')[0]} has been muted for ${muteDuration} minutes ⏱️. Use @ to unmute`,
            mentions: [mentionedJid],
        };
        await conn.sendMessage(m.chat, muteMessage);

        // Remove mute after the specified time
        setTimeout(() => {
            user.muted = false;
            conn.sendMessage(m.chat, {
                text: ` @${mentionedJid.split('@')[0]} has been automatically unmuted ✅`,
                mentions: [mentionedJid],
            });
        }, muteDuration * 60 * 1000);
    }

    if (command === 'cold') {
        const mentionedJid = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!mentionedJid) throw 'Missing tag❗';

        const user = global.db.data.users[mentionedJid] || {};
        if (!user.muted) throw 'This user is not muted❕';

        user.muted = false;

        // Unmute notification
        const unmuteMessage = {
            text: `User @${mentionedJid.split('@')[0]} has been unmuted ✔︎`,
            mentions: [mentionedJid],
        };
        await conn.sendMessage(m.chat, unmuteMessage);
    }
};

// Define commands and options
handler.command = /^(cold|freeze)$/i;
handler.admin = true;
handler.botAdmin = true;
handler.group = true;

export default handler;
