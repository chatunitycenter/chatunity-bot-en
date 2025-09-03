setInterval(async () => {
  let chats = global.db.data.chats
  for (let chatId in chats) {
    if (!chats[chatId].accetta39) continue
    try {
      const pending = await conn.groupRequestParticipantsList(chatId)
      if (pending.length) {
        for (let p of pending) {
          const jid = p.jid
          const number = jid.split('@')[0]
          if (!number.startsWith('39') || number.slice(2).startsWith('0')) {
            await conn.groupRequestParticipantsUpdate(chatId, [jid], 'reject')
          } else {
            await conn.groupRequestParticipantsUpdate(chatId, [jid], 'approve')
          }
        }
      }
    } catch (e) {}
  }
}, 1000)

const handler = async (m, { conn, isAdmin, isBotAdmin, isOwner, command }) => {
  if (!(isAdmin || isOwner)) {
    throw '*Only admins can use this command*'
  }
  
  if (!isBotAdmin) {
    throw '*The bot must be admin to use this function*'
  }

  let chat = global.db.data.chats[m.chat]
  
  if (chat.accetta39) {
    chat.accetta39 = false
    await m.reply('*❌ Automatic acceptance of Italian numbers disabled*')
  } else {
    chat.accetta39 = true
    await m.reply('*✅ Automatic acceptance of Italian numbers enabled*\n\nItalian numbers (39) will be accepted automatically, others will be rejected')
  }
}

handler.command = /^(accetta39)$/i
handler.group = true

export default handler
