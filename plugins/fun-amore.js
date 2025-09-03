import axios from 'axios';

let handler = async (m, { conn, command, usedPrefix }) => {
  const mentions = m.mentionedJid || [];

  let user1, user2;

  if (command === 'crush') {
    if (mentions.length !== 1) {
      return m.reply(`❗ Use the command like this:\n${usedPrefix + command} @user`);
    }
    user1 = m.sender;
    user2 = mentions[0];
  } else if (command === 'ship') {
    if (mentions.length === 1) {
      // only 1 tag: ship between you and the other
      user1 = m.sender;
      user2 = mentions[0];
    } else if (mentions.length >= 2) {
      user1 = mentions[0];
      user2 = mentions[1];
    } else {
      return m.reply(`❗ Use the command like this:\n${usedPrefix + command} @user1 [@user2]`);
    }
  }

  if (!user1 || !user2) return m.reply('❌ Invalid users.');

  // Get names
  let name1 = 'User 1';
  let name2 = 'User 2';
  try { name1 = await conn.getName(user1); } catch {}
  try { name2 = await conn.getName(user2); } catch {}

  // Get avatar (with fallback)
  let avatar1, avatar2;
  try {
    avatar1 = await conn.profilePictureUrl(user1, 'image');
  } catch {
    avatar1 = 'https://telegra.ph/file/6880771a42bad09dd6087.jpg';
  }

  try {
    avatar2 = await conn.profilePictureUrl(user2, 'image');
  } catch {
    avatar2 = 'https://telegra.ph/file/6880771a42bad09dd6087.jpg';
  }

  // Background and percentage
  const background = 'https://i.ibb.co/4YBNyvP/images-76.jpg';
  const percent = Math.floor(Math.random() * 101);

  // Build API URL
  const apiUrl = `https://api.siputzx.my.id/api/canvas/ship?avatar1=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}&background=${encodeURIComponent(background)}&persen=${percent}`;

  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    const caption = `💘 *@${user1.split('@')[0]}* ❤️ *@${user2.split('@')[0]}*\n🔮 Compatibility: *${percent}%*`;

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption,
      mentions: [user1, user2],
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    return m.reply('❌ Error generating the image.');
  }
};

handler.help = ['ship @user1 [@user2]', 'crush @user'];
handler.tags = ['fun'];
handler.command = /^(ship|crush)$/i;

export default handler;
