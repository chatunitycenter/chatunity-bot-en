let cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
  let user = global.db.data.users[m.sender]
  let cooldownTime = 5 * 60 // 5 minutes cooldown

  // Check cooldown
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < cooldownTime * 1000) {
    let remainingTime = formatTime(Math.ceil((cooldowns[m.sender] + cooldownTime * 1000 - Date.now()) / 1000));
    let message = `⏳ Please wait *${remainingTime}* before working again.`
    await conn.sendMessage(m.chat, { 
        text: message,
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: 'ChatUnity'
            }
        }
    }, { quoted: m });
    return;
  }

  // Generate random reward
  let reward = Math.floor(Math.random() * 5000)
  cooldowns[m.sender] = Date.now()

  // Assign XP and send message
  user.exp += reward
  let rewardMessage = `💼 You earned *${formatNumber(reward)}* (${reward}) XP! 💫`;
  await conn.sendMessage(m.chat, { 
      text: rewardMessage,
      contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: '120363259442839354@newsletter',
              serverMessageId: '',
              newsletterName: 'ChatUnity'
          }
      }
  });
}
