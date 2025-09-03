import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';
import fs from 'fs';

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const mention = m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
        ? m.quoted.sender
        : m.sender;
        
    const who = mention || m.sender;

    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.users[who]) global.db.data.users[who] = { friends: [] };

    const user = global.db.data.users[who];
    const friends = user.friends || [];

    const lastFriend = friends[friends.length - 1];
    const lastFriendName = lastFriend ? lastFriend.split('@')[0] : 'None';

    const friendList = friends.length > 0
      ? friends.map((friend, index) => `${index + 1}. @${friend.split('@')[0]}`).join('\n')
      : 'None';

    const message = `📜 *Friend List of ${user.name && user.name.trim() !== '' ? user.name : 'Unknown'}*
┌───────────────
│ 👤 *Last Friend:* ${friends.length > 0 ? "@" + lastFriendName : 'None'}
│
│ 👥 *Full List:*
${friends.length > 0 ? friendList : '│   None — congrats lone wolf 🐺'}
└───────────────`;

    await conn.sendMessage(m.chat, {
      text: message,
      mentions: friends
    }, { quoted: m });

  } catch (err) {
    console.error('Error in handler:', err);
    conn.reply(m.chat, "❌ An error occurred while executing the command.");
  }
};

handler.command = ['friendlist'];
export default handler;
