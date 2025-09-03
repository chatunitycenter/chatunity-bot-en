async function handler(m, { isBotAdmin, isOwner, text, conn }) {
  if (!isBotAdmin) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ I need to be an admin to perform this action.'
    }, { quoted: m });
  }

  const mention = m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.quoted 
      ? m.quoted.sender 
      : m.quoted;

  if (!mention) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Please mention the user you want to remove.'
    }, { quoted: m });
  }

  const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

  if (mention === ownerBot) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ You cannot remove the bot creator.'
    }, { quoted: m });
  }

  if (mention === conn.user.jid) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ You cannot remove the bot itself.'
    }, { quoted: m });
  }

  if (mention === m.sender) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ You cannot remove yourself.'
    }, { quoted: m });
  }

  const groupMetadata = conn.chats[m.chat]?.metadata;
  const participants = groupMetadata?.participants || [];
  const user = participants.find(u => conn.decodeJid(u.id) === mention);

  const isGroupOwner = user?.admin === 'superadmin';
  const isAdmin = user?.admin === 'admin';

  if (isGroupOwner) {
    return await conn.sendMessage(m.chat, {
      text: "ⓘ The user you're trying to remove is the group creator."
    }, { quoted: m });
  }

  if (isAdmin) {
    return await conn.sendMessage(m.chat, {
      text: "ⓘ The user you're trying to remove is an admin."
    }, { quoted: m });
  }

  const reason = text ? `\n\n𝐑𝐞𝐚𝐬𝐨𝐧: ${text.replace(/@\d+/g, '').trim()}` : '';
  
  await conn.sendMessage(m.chat, {
    text: `@${mention.split`@`[0]} has been removed by @${m.sender.split`@`[0]}${reason}`,
    mentions: [mention, m.sender]
  }, { quoted: m });

  await conn.groupParticipantsUpdate(m.chat, [mention], 'remove');
}

handler.customPrefix = /kick|avadakedavra|disappear|smurf/i;
handler.command = new RegExp;
handler.admin = true;

export default handler;
