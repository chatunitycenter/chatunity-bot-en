import { performance } from 'perf_hooks'

let handler = async (m, { conn, text }) => {
  let botName = global.db.data.nomedelbot || `𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲`

  // Identify the recipient: replied to or mentioned
  let recipient;
  if (m.quoted && m.quoted.sender) {
    recipient = m.quoted.sender;
  } else if (m.mentionedJid && m.mentionedJid.length > 0) {
    recipient = m.mentionedJid[0];
  } else {
    return m.reply("Tag someone or reply to a message to jerk them off 😏");
  }

  let recipientName = `@${recipient.split('@')[0]}`

  // Initial message
  let { key } = await conn.sendMessage(m.chat, { 
    text: `Now jerking off ${recipientName}...`,
    mentions: [recipient]
  }, { quoted: m })

  const array = [
    "8===👊=D", "8=👊===D", "8==👊==D", "8===👊=D", "8===👊=D💦"
  ]

  for (let item of array) {
    await conn.sendMessage(m.chat, { 
      text: `${item}`, 
      edit: key,
      mentions: [recipient]
    }, { quoted: m })
    await new Promise(resolve => setTimeout(resolve, 20))
  }

  // Final message
  return conn.sendMessage(m.chat, { 
    text: `Oh ${recipientName} is cumming! 😋💦`,
    edit: key,
    mentions: [recipient]
  }, { quoted: m })
}

handler.help = ['handjob']
handler.tags = ['fun']
handler.command = /^(handjob)$/i

export default handler
