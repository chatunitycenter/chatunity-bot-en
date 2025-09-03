let handler = async (m, { conn, args, groupMetadata }) => {
  let botName = global.db.data.nomedelbot || `ChatUnity`
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
  else who = m.chat
  if (!who) return
  if (!(who in global.db.data.users)) return
  
  let warn = global.db.data.users[who].warn
  if (warn > 0) {
    global.db.data.users[who].warn -= 1
    
    const messageOptions = {
      text: `✅ Warning removed\nRemaining warnings: ${warn - 1}`,
      contextInfo: {
        mentionedJid: [who],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363259442839354@newsletter',
          serverMessageId: '',
          newsletterName: `${botName}`
        }
      }
    }

    await conn.sendMessage(m.chat, messageOptions)
  } else if (warn == 0) {
    return
  }
}

handler.help = ['delwarn @user']
handler.tags = ['group']
handler.command = ['delwarn', 'unwarn'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler