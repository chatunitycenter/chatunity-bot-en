import { performance } from 'perf_hooks'

let handler = async (m, { conn, usedPrefix }) => {
  let botName = global.db.data.botname || `𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲`
  
  const messageOptions = {
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363259442839354@newsletter',
        serverMessageId: '',
        newsletterName: `${botName}`
      }
    }
  }

  await conn.sendMessage(m.chat, {
    text: `𝐓𝐫𝐲 𝐚𝐠𝐚𝐢𝐧, 𝐲𝐨𝐮'𝐥𝐥 𝐛𝐞 𝐥𝐮𝐜𝐤𝐢𝐞𝐫 😂`,
    ...messageOptions
  })
}

handler.help = ['autoadmin']
handler.tags = ['fun']
handler.command = /^(autoadmin)$/i

export default handler
