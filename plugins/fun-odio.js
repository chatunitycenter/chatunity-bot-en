let handler = async (m, { conn, command, text }) => {
    // Get bot name from global database or use default
    let botName = global.db.data.botname || `ChatUnity`
  
    // Create hate calculator message with random percentage
    let hate = `──────────────\nHATE CALCULATOR 😡
  The hate between you and ${text}: ${Math.floor(Math.random() * 100)}%\n──────────────`.trim()
  
    // Send message to chat with special formatting
    await conn.sendMessage(m.chat, {
      text: hate,
      contextInfo: {
        mentionedJid: conn.parseMention(hate),      // Parse any mentioned users
        forwardingScore: 999,                       // High forwarding score
        isForwarded: true,                          // Mark as forwarded message
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363259442839354@newsletter',
          serverMessageId: '',
          newsletterName: `${botName}`              // Use bot name as newsletter name
        }
      }
    })
  }
  
  // Command configuration
  handler.command = /^(hate)$/i           // Trigger: "hate" (case insensitive)
  handler.tags = ['fun']                  // Category: fun commands
  handler.help = ['hate @tag']            // Help text showing usage
  
  export default handler
