let cooldowns = {};

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let users = global.db.data.users;

  const senderId = m.sender;
  const senderName = await conn.getName(senderId);

  // Find the target: from mention or quoted message
  let targetId = m.mentionedJid?.[0] || m.quoted?.sender;

  if (!targetId) {
    return m.reply(`🧠 Tag someone or reply to a message to rob.\n\n📌 Example:\n${usedPrefix + command} @user`);
  }

  if (targetId === senderId) {
    return m.reply('🤡 You cannot rob yourself.');
  }

  // Initialize users if they don't exist
  if (!users[senderId]) users[senderId] = { limit: 10 };
  if (!users[targetId]) users[targetId] = { limit: 10 };

  // 5 minute cooldown
  const cooldownTime = 5 * 60 * 1000;
  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < cooldownTime) {
    let timeRemaining = formatTime(Math.ceil((cooldowns[senderId] + cooldownTime - Date.now()) / 1000));
    return m.reply(`🚨 You've already robbed recently! Try again in ⏱ *${timeRemaining}*`);
  }

  cooldowns[senderId] = Date.now();

  const minSteal = 50;
  const maxSteal = 100;
  const amount = Math.floor(Math.random() * (maxSteal - minSteal + 1)) + minSteal;

  const outcome = Math.floor(Math.random() * 3); // 0 = success, 1 = caught, 2 = partial

  switch (outcome) {
    case 0: // Success
      users[senderId].limit += amount;
      users[targetId].limit = Math.max(0, users[targetId].limit - amount);
      await conn.sendMessage(m.chat, {
        text: `💰 Successful heist! You robbed *${amount} 💶 UC* from @${targetId.split("@")[0]}.\n\n*+${amount} 💶* added to your balance.`,
        mentions: [targetId]
      }, { quoted: m });
      break;

    case 1: // Caught
      let fine = Math.min(Math.floor(Math.random() * (users[senderId].limit - minSteal + 1)) + minSteal, maxSteal);
      fine = Math.max(0, fine);
      users[senderId].limit = Math.max(0, users[senderId].limit - fine);
      await conn.reply(m.chat, `🚓 You've been arrested! Fine of *-${fine} 💶 UC* for ${senderName}.`, m);
      break;

    case 2: // Partial
      let partial = Math.min(Math.floor(Math.random() * (users[targetId].limit / 2 - minSteal + 1)) + minSteal, maxSteal);
      partial = Math.max(0, partial);
      users[senderId].limit += partial;
      users[targetId].limit = Math.max(0, users[targetId].limit - partial);
      await conn.sendMessage(m.chat, {
        text: `💸 You only robbed *${partial} 💶 UC* from @${targetId.split("@")[0]}.\n\n*+${partial} 💶* added to your balance.`,
        mentions: [targetId]
      }, { quoted: m });
      break;
  }

  global.db.write();
};

handler.help = ['rob @user', 'steal'];
handler.tags = ['rpg'];
handler.command = ['rob', 'steal'];
handler.register = true;
handler.group = true;

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export default handler;
