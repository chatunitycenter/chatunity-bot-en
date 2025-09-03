let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {
  let war = 2

  let who
  if (m.isGroup) {
    who = m.mentionedJid?.[0] || m.quoted?.sender
  } else {
    who = m.chat
  }

  if (!who) return m.reply("❌ You must mention a user or reply to their message.")

  if (who === conn.user.jid) {
    return m.reply("🚫 You cannot warn the bot.")
  }

  if (!(who in global.db.data.users)) {
    return m.reply("❌ User not found in the database.")
  }

  let user = global.db.data.users[who]
  let warn = user.warn || 0
  let botName = global.db.data.nomedelbot || `ChatUnity`

  const messageOptions = {
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

  if (warn < war) {
    user.warn += 1
    await conn.sendMessage(m.chat, {
      text: `⚠️ WARNING ${user.warn}/3 (3 warns = ban)`,
      ...messageOptions
    })
  } else if (warn >= war) {
    user.warn = 0
    await conn.sendMessage(m.chat, {
      text: `⛔ USER REMOVED AFTER 3 WARNINGS (They pushed it too far)`,
      ...messageOptions
    })
    await sleep(1000)
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
  }
}

handler.help = ['warn @user']
handler.tags = ['group']
handler.command = /^(ammonisci|avvertimento|warn|warning)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))