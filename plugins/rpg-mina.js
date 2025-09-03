let cooldowns = {};

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  
  // Safe initialization
  user.exp = Number(user.exp) || 0;
  
  let result = Math.floor(Math.random() * 5000);
  let name = conn.getName(m.sender);
  let waitTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < waitTime) {
    let remainingTime = secondsToMS(Math.ceil((cooldowns[m.sender] + waitTime - Date.now()) / 1000));
    await conn.sendMessage(m.chat, { 
        text: `⏳ ${name}, please wait another ${remainingTime} before mining again.`,
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

  user.exp += result;
  await conn.sendMessage(m.chat, { 
      text: `⛏ *MINING COMPLETED!*\n
You gained *${result} XP*!\n
New total: ${user.exp} XP`,
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
};
    
