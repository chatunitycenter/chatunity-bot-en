let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Get bot name from database or use default
    let botName = global.db.data.botname || `ChatUnity`
  
    let setting = {
      '': 'announcement'
    }[args[0] || '']
    
    if (setting === undefined) return
    
    await conn.groupSettingUpdate(m.chat, setting)
    
    // Send message with newsletter forwarding
    await conn.sendMessage(m.chat, {
      text: 'Chat for admins only',
      contextInfo: {
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
  
  handler.help = ['group open / close', 'group open / closed']
  handler.tags = ['group']
  handler.command = /^(closed)$/i
  handler.admin = true
  handler.botAdmin = true
  
  export default handler
