let handler = async (m, { conn, command, text }) => {
if (!text) throw `Tag who you want to roast 🥵🤤`
let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
conn.reply(m.chat, `
*𝐘𝐎𝐔'𝐑𝐄 𝐑𝐎𝐀𝐒𝐓𝐈𝐍𝐆 ${text} !*

𝙮𝙤𝙪'𝙫𝙚 𝙗𝙚𝙚𝙣 𝙧𝙤𝙖𝙨𝙩𝙚𝙙 𝙖𝙩 𝟵𝟬% 𝙖𝙣𝙙 𝙩𝙧𝙚𝙖𝙩𝙚𝙙 𝙡𝙞𝙠𝙚 𝙖 𝙨𝙚𝙘𝙤𝙣𝙙-𝙧𝙖𝙩𝙚 𝙘𝙡𝙤𝙬𝙣 " 𝐀𝐡𝐡𝐡.., 𝐀𝐚𝐚𝐚𝐡𝐡, 𝐤𝐞𝐞𝐩 𝐠𝐨𝐢𝐧𝐠, 𝐝𝐨𝐧'𝐭 𝐬𝐭𝐨𝐩, 𝐝𝐨𝐧'𝐭 𝐬𝐭𝐨𝐩 " 𝙖𝙣𝙙 𝙮𝙤𝙪'𝙫𝙚 𝙗𝙚𝙚𝙣 𝙡𝙚𝙛𝙩 𝙨𝙤 𝙙𝙚𝙛𝙚𝙖𝙩𝙚𝙙 𝙩𝙝𝙖𝙩 𝙮𝙤𝙪 𝙘𝙖𝙣'𝙩 𝙚𝙫𝙚𝙣 𝙨𝙩𝙖𝙣𝙙 𝙪𝙥 𝙮𝙤𝙪 𝙨𝙞𝙡𝙡𝙮 𝙛𝙤𝙤𝙡

*${text}* 
🤤🥵 *¡𝐘𝐎𝐔'𝐕𝐄 𝐁𝐄𝐄𝐍 𝐓𝐎𝐓𝐀𝐋𝐋𝐘 𝐑𝐎𝐀𝐒𝐓𝐄𝐃!* 🥵🤤`, null, { mentions: [user] })
}

handler.customPrefix = /roast/i
handler.admin = true
handler.command = new RegExp
export default handler
