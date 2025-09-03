// Plugin: Adults Only (Enable/disable phsearch for 18+)
// Enable with: .enable adultsonly | .disable adultsonly

let handler = async (m, { conn, command, usedPrefix, args, isAdmin, isOwner }) => {
  const chat = global.db.data.chats[m.chat];
  if (!chat) return m.reply('Unable to find group data.');

  // Only admin or owner can enable/disable
  if (!isAdmin && !isOwner) return m.reply('Only admins can enable/disable this feature.');

  if (/enable/i.test(command)) {
    chat.solomaggiorenni = true;
    return m.reply('✅ Adults Only enabled! Now the .phsearch command is available.');
  } else if (/disable/i.test(command)) {
    chat.solomaggiorenni = false;
    return m.reply('❌ Adults Only disabled! Now the .phsearch command is NO longer available.');
  } else {
    return m.reply(`Use:\n${usedPrefix}enable adultsonly\n${usedPrefix}disable adultsonly`);
  }
};

handler.help = ['enable adultsonly', 'disable adultsonly'];
handler.tags = ['security'];
handler.command = /^(enable|disable)\s?adultsonly$/i;
handler.admin = true;
handler.group = true;

export default handler;
