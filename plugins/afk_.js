let handler = m => m;
handler.before = async function (m, { text, args, usedPrefix, command, conn }) {
    let user = global.db.data.users[m.sender];
    if (user.afk > -1) {
        await conn.reply(m.chat, `🔔 *AFK Status Removed* 🔔
*------------------------------*
@${m.sender.split("@")[0]} is no longer AFK.${user.afkReason ? `\nReason: 👉 ${user.afkReason}` : ''}

Time AFK:\n👉 *${msToTime(new Date - user.afk)}*`.trim(), m, { mentions: [m.sender] });
        user.afk = -1;
        user.afkReason = '';
    }
    let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
    for (let jid of jids) {
        let user = global.db.data.users[jid];
        if (!user)
            continue;
        let afkTime = user.afk;
        if (!afkTime || afkTime < 0)
            continue;
        let reason = user.afkReason || '';
        await conn.reply(m.chat, `🔔 *AFK Notice* 🔔
*------------------------------*
😾 This user is currently AFK.\n${reason ? `Reason: 👉 ${reason}` : `No reason provided.`}

Time AFK:\n👉 *${msToTime(new Date - user.afk)}*`.trim(), m);
    }
    return true;
};

// Helper function to format milliseconds to human-readable time
function msToTime(duration) {
    // Convert milliseconds to hours, minutes, seconds
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days = Math.floor((duration / (1000 * 60 * 60 * 24)));

    let timeStr = '';
    if (days) timeStr += days + 'd ';
    if (hours) timeStr += hours + 'h ';
    if (minutes) timeStr += minutes + 'm ';
    if (seconds) timeStr += seconds + 's ';
    return timeStr.trim() || '0s';
}

export default handler;
