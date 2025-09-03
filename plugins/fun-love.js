let handler = async (m, { conn, command, text }) => {
    let love = `︶︶ ⊹ ︶︶ ⊹ ︶︶︶ ୨♡୧ ︶︶︶ ⊹ ︶︶ ⊹ ︶︶\nLOVE CALCULATOR ❤️\nCompatibility between ${text} and you: ${Math.floor(Math.random() * 100)}%\n︶︶ ⊹ ︶︶ ⊹ ︶︶︶ ୨♡୧ ︶︶︶ ⊹ ︶︶ ⊹ ︶︶`.trim()
    
    // Get bot name from database or use default
    let botName = global.db.data.botname || `ChatUnity`
  
    await conn.sendMessage(m.chat, { 
      text: love,
      contextInfo: {
        mentionedJid: conn.parseMention(love),
        forwardingScore: 99,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363259442839354@newsletter',
          serverMessageId: '',
          newsletterName: `${botName}`
        }
      }
    }, { quoted: m })
  }
  
  handler.help = ['love']
  handler.tags = ['fun']
  handler.command = /^(love|compatibility)$/i
  export default handler
