// Credits by Gabs & AntiPrivate Updated

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  let message = "";
  for (const [ownerNumber] of global.owner) {
    message += `\n> 📞+${ownerNumber}`;
  }
  if (m.isBaileys && m.fromMe) return true;
  if (m.isGroup) return false;
  if (!m.message) return true;
  let chat = global.db.data.chats[m.chat];
  let bot = global.db.data.settings[this.user.jid] || {};
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await conn.sendMessage(m.chat, {
      text: `ೋೋ══ • ══ೋೋ
You do not have permission to send messages to the bot's private chat.

> For more information or support, you can contact the creators using the following references below:
${message}
`
    });
    return false;
  }
  return true;
}
