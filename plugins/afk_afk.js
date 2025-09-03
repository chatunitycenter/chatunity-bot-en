// AFK deactivation
if (user?.afk) {
    const duration = formatTime(new Date() - user.afk.time)
    await conn.sendMessage(m.chat, {
        text: `▶️ *Back online*\nUser: @${m.sender.split('@')[0]}\n⏱️ AFK duration: ${duration}\n📌 Reason: ${user.afk.reason}`,
        mentions: [m.sender]
    })
    delete user.afk
}

// Mention handling
if (m.mentionedJid?.length > 0) {
    const now = new Date()
    for (const jid of m.mentionedJid) {
        const user = global.db.data.users[jid]
        if (user?.afk) {
            const duration = formatTime(now - user.afk.time)
            await conn.sendMessage(m.chat, {
                text: `⏸️ *User AFK*\n@${jid.split('@')[0]} is offline\n⏱️ Since: ${duration}\n📌 Reason: ${user.afk.reason}`,
                mentions: [jid]
            })
        }
    }
}
