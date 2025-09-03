const free = 500
const premium = 1000
const cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
  let user = global.db.data.users[m.sender]
  const waitTime = 24 * 60 * 60 // 24 hours in seconds
  
  // Cooldown check
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < waitTime * 1000) {
    const timeRemaining = formatTime(Math.ceil((cooldowns[m.sender] + waitTime * 1000 - Date.now()) / 1000))
    let message = `🚩 𝐲𝐨𝐮 𝐡𝐚𝐯𝐞 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐜𝐨𝐥𝐥𝐞𝐜𝐭𝐞𝐝 𝐲𝐨𝐮𝐫 𝐝𝐚𝐢𝐥𝐲 𝐫𝐞𝐰𝐚𝐫𝐝.\n𝐲𝐨𝐮 𝐜𝐚𝐧 𝐨𝐧𝐥𝐲 𝐜𝐥𝐚𝐢𝐦 𝐢𝐭 𝐨𝐧𝐜𝐞 𝐞𝐯𝐞𝐫𝐲 𝟐𝟒𝐡.\n\n𝐧𝐞𝐱𝐭 𝐫𝐞𝐰𝐚𝐫𝐝: +${isPrems ? premium : free} 💶 𝐔𝐂\n 𝐢𝐧: ⏱ ${timeRemaining}`;
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
    }, { quoted: m, detectLink: true });
    return;
  }

  // Assign Unitycoins to balance (limit)
  user.limit += isPrems ? premium : free
  cooldowns[m.sender] = Date.now(); // Set cooldown
  
  let message = `🚩 𝐜𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! 🎉, 𝐲𝐨𝐮 𝐡𝐚𝐯𝐞 𝐫𝐞𝐜𝐞𝐢𝐯𝐞𝐝 *+${isPrems ? premium : free} 💶 𝐔𝐂!\n\n` +
                `𝐲𝐨𝐮 𝐧𝐨𝐰 𝐡𝐚𝐯𝐞: *${user.limit} 💶 𝐔𝐂* 𝐢𝐧 𝐲𝐨𝐮𝐫 𝐛𝐚𝐥𝐚𝐧𝐜𝐞`;
  
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
  }, { quoted: m, detectLink: true });
}

handler.help = ['daily'];
handler.tags = ['rpg'];
handler.command = ['daily', 'claim'];
handler.register = true;

function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

export default handler;
