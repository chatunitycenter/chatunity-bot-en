let handler = async (m, { conn, text }) => {
    // Initialize data structure if it doesn't exist
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
    
    // Set AFK status
    global.db.data.users[m.sender].afk = {
        time: new Date(),
        reason: text || 'No reason provided'
    }
    
    // Confirm activation
    await conn.sendMessage(m.chat, {
        text: `⏸️ *AFK mode activated*\nUser: @${m.sender.split('@')[0]}\nReason: ${text || 'No reason provided'}`,
        mentions: [m.sender]
    }, { quoted: m })
}

handler.command = /^afk$/i
handler.group = true
export default handler
