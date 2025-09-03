import MessageType from '@whiskeysockets/baileys'

let tax = 0.02 // 2% tax on transactions

let handler = async (m, { conn, text }) => {
  let who
  if (m.isGroup) who = m.mentionedJid[0] // If in group, take the mentioned user
  else who = m.chat // If in private, use current user
  
  if (!who) throw '🚩 𝐲𝐨𝐮 𝐦𝐮𝐬𝐭 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐚 𝐮𝐬𝐞𝐫 𝐰𝐢𝐭𝐡 @user*'
  
  let txt = text.replace('@' + who.split`@`[0], '').trim()
  if (!txt) throw '🚩 𝐞𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐚𝐦𝐨𝐮𝐧𝐭 𝐨𝐟 💫 𝐗𝐏 𝐭𝐨 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫'
  if (isNaN(txt)) throw '🚩 𝐞𝐧𝐭𝐞𝐫 𝐨𝐧𝐥𝐲 𝐧𝐮𝐦𝐛𝐞𝐫𝐬 𝐢𝐝𝐢𝐨𝐭'
  
  let xp = parseInt(txt)
  let exp = xp
  let taxAmount = Math.ceil(xp * tax) // Calculate 2% tax
  exp += taxAmount
  
  if (exp < 1) throw '🚩 𝐦𝐢𝐧𝐢𝐦𝐮𝐦 𝐭𝐨 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫 𝐢𝐬 1 💫 𝐗𝐏'
  
  let users = global.db.data.users
  if (exp > users[m.sender].exp) throw '🚩 𝐲𝐨𝐮 𝐝𝐨𝐧\'𝐭 𝐡𝐚𝐯𝐞 𝐞𝐧𝐨𝐮𝐠𝐡 💫 𝐗𝐏 𝐛𝐫𝐨, 𝐲𝐨𝐮 𝐧𝐞𝐞𝐝 𝐦𝐨𝐫𝐞 𝐞𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞'
  
  // Execute the transaction
  users[m.sender].exp -= exp
  users[who].exp += xp

  // Confirmation message
  let confirmationMessage = `📊 *𝐭𝐫𝐚𝐧𝐬𝐚𝐜𝐭𝐢𝐨𝐧 𝐫𝐞𝐩𝐨𝐫𝐭*\n\n` +
                            `▸ 𝐗𝐏 𝐭𝐫𝐚𝐧𝐬𝐟𝐞𝐫𝐫𝐞𝐝: *-${xp} 💫*\n` +
                            `▸ 𝐭𝐚𝐱 (2%): *-${taxAmount} 💫*\n` +
                            `▸ 𝐭𝐨𝐭𝐚𝐥 𝐝𝐞𝐝𝐮𝐜𝐭𝐞𝐝: *-${exp} 💫*`;
  await conn.sendMessage(m.chat, { 
      text: confirmationMessage,
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

  // Notify recipient
  let recipientMessage = `📩 𝐲𝐨𝐮 𝐫𝐞𝐜𝐞𝐢𝐯𝐞𝐝 +${xp} 💫 𝐗𝐏!`;
  await conn.sendMessage(m.chat, { 
      text: recipientMessage,
      contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: '120363259442839354@newsletter',
              serverMessageId: '',
              newsletterName: 'ChatUnity'
          }
      }
  }, { quoted: m, mentions: [who] });
}

handler.help = ['givexp *@user <amount>*']
handler.tags = ['rpg']
handler.command = ['givexp', 'giveexp', 'transferxp'] 
handler.register = true 

export default handler
