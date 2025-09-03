import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'

const handler = async (m, { conn }) => {
  try {
    if (!m.isGroup) {
      return conn.sendMessage(m.chat, { text: "❌ This command can only be used in groups." }, { quoted: m })
    }

    const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : m.sender)
    const who = mention || m.sender

    if (!global.db.data.users[who]) {
      global.db.data.users[who] = {
        money: 0, warn: 0, warnlink: 0,
        mute: false, banned: false,
        messages: 0, blasphemy: 0,
        blasphemyCounted: 0,
        command: 0, slotWins: 0,
        category: null, instagram: null,
        age: null, gender: null
      }
    }

    const user = global.db.data.users[who]

    const ranks = [
      "𝐁𝐞𝐠𝐢𝐧𝐧𝐞𝐫 𝐈 😐", "𝐁𝐞𝐠𝐢𝐧𝐧𝐞𝐫 𝐈𝐈 😐",
      "𝐑𝐞𝐜𝐫𝐮𝐢𝐭 𝐈 🙂", "𝐑𝐞𝐜𝐫𝐮𝐢𝐭 𝐈𝐈 🙂",
      "𝐀𝐝𝐯𝐚𝐧𝐜𝐞𝐝 𝐈 🫡", "𝐀𝐝𝐯𝐚𝐧𝐜𝐞𝐝 𝐈𝐈 🫡",
      "𝐁𝐨𝐦𝐛𝐞𝐫 𝐈 😎", "𝐁𝐨𝐦𝐛𝐞𝐫 𝐈𝐈 😎",
      "𝐏𝐫𝐨 𝐈 😤", "𝐏𝐫𝐨 𝐈𝐈 😤",
      "𝐄𝐥𝐢𝐭𝐞 𝐈 🤩", "𝐄𝐥𝐢𝐭𝐞 𝐈𝐈 🤩",
      "𝐌𝐚𝐬𝐭𝐞𝐫 𝐈 💪🏼", "𝐌𝐚𝐬𝐭𝐞𝐫 𝐈𝐈 💪🏼",
      "𝐌𝐲𝐭𝐡𝐢𝐜 𝐈 🔥", "𝐌𝐲𝐭𝐡𝐢𝐜 𝐈𝐈 🔥",
      "𝐇𝐞𝐫𝐨 𝐈 🎖", "𝐇𝐞𝐫𝐨 𝐈𝐈 🎖",
      "𝐂𝐡𝐚𝐦𝐩𝐢𝐨𝐧 𝐈 🏆", "𝐂𝐡𝐚𝐦𝐩𝐢𝐨𝐧 𝐈𝐈 🏆",
      "𝐃𝐨𝐦𝐢𝐧𝐚𝐭𝐨𝐫 𝐈 🥶", "𝐃𝐨𝐦𝐢𝐧𝐚𝐭𝐨𝐫 𝐈𝐈 🥶",
      "𝐒𝐭𝐞𝐥𝐥𝐚𝐫 𝐈 💫", "𝐒𝐭𝐞𝐥𝐥𝐚𝐫 𝐈𝐈 💫",
      "𝐂𝐨𝐬𝐦𝐢𝐜 𝐈 🔮", "𝐂𝐨𝐬𝐦𝐢𝐜 𝐈𝐈 🔮",
      "𝐓𝐢𝐭𝐚𝐧 𝐈 😈", "𝐓𝐢𝐭𝐚𝐧 𝐈𝐈 😈",
      "𝐋𝐞𝐠𝐞𝐧𝐝 𝐈 ⭐️", "𝐋𝐞𝐠𝐞𝐧𝐝 𝐈𝐈 ⭐️",
    ]

    const level = Math.floor(user.messages / 1000)
    const rank = level >= 30 ? "𝐄𝐜𝐥𝐢𝐩𝐬𝐢𝐚𝐧 ❤️‍🔥" : (ranks[level] || "-")

    const groupMetadata = await conn.groupMetadata(m.chat)
    const participants = groupMetadata.participants
    const groupOwner = groupMetadata.owner

    const participant = participants.find(p => p.id === who)
    const isAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin')
    const isFounder = who === groupOwner

    const role = isFounder ? '𝐅𝐨𝐮𝐧𝐝𝐞𝐫 ⚜️' : isAdmin ? '𝐀𝐝𝐦𝐢𝐧 👑' : '𝐌𝐞𝐦𝐛𝐞𝐫 🤍'

    const genderEmoji = user.gender === "male" ? "🚹" : user.gender === "female" ? "🚺" : "Not set"

    let pic
    try {
      const res = await fetch(pic)
      const arrayBuffer = await res.arrayBuffer()
      pic = Buffer.from(arrayBuffer)
    } catch (error) {
      const res = await fetch('https://qu.ax/LoGxD.png')
      const arrayBuffer = await res.arrayBuffer()
      pic = Buffer.from(arrayBuffer)
    }

    conn.sendMessage(m.chat, {
      text: `꧁════ ☾︎•✮•☽︎ ════꧂\n` +
        ` 📝 𝕄𝕖𝕤𝕤𝕒𝕘𝕖𝕤: ${user.messages || 0}\n` +
        ` ⚠️ 𝕎𝕒𝕣𝕟: ${user.warn || 0} / 4\n` +
        ` 🟣 ℝ𝕠𝕝𝕖: ${role}\n` +
        ` 🗓️ 𝔸𝕘𝕖: ${user.age ? user.age + " years" : "Not set"}\n` +
        ` 🚻 𝔾𝕖𝕟𝕕𝕖𝕣: ${genderEmoji}\n` +
        ` 🤬 𝐁𝐥𝐚𝐬𝐩𝐡𝐞𝐦𝐲: ${user.blasphemy || 0}\n` +
        `${user.instagram ? ` 🌐 instagram.com/${user.instagram}` : ' 🌐 Instagram: Not set'}\n` +
        '> thanks daddy Riad\n' +
        `꧁════ ☾︎•✮•☽︎ ════꧂`,
      contextInfo: {
        mentionedJid: [who],
        externalAdReply: {
          title: `${user.name || 'Unknown'}`,
          body: `𝒄𝒓𝒆𝒂𝒕𝒊𝒐𝒏 𝒃𝒚 𝑶𝒏𝒊𝒙🌟`,
          thumbnail: pic,
        }
      },
      footer: 'Set your personal data:',
      viewOnce: true,
      headerType: 4
    }, { quoted: m })

  } catch (error) {
    console.error(error)
  }
}

handler.command = /^(info)$/i
export default handler