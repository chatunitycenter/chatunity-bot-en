let handler = async (m, { conn }) => {
  if (!m.isGroup) return;

  let groupMetadata = await conn.groupMetadata(m.chat);
  let participants = groupMetadata.participants;

  let users = global.db.data.users;

  let groupUsers = participants
    .map(p => ({
      id: p.id,
      blasphemies: users[p.id]?.blasphemy || 0,
    }))
    .filter(u => u.blasphemies > 0)
    .sort((a, b) => b.blasphemies - a.blasphemies)
    .slice(0, 10);

  let text = `🏆 *Top 10 Blasphemers in the Group* 🏆\n\n`;
  groupUsers.forEach((user, index) => {
    text += `${index + 1}. @${user.id.split('@')[0]} - ${user.blasphemies} blasphemies\n`;
  });

  if (groupUsers.length === 0) {
    text = "😇 Nobody has blasphemed in this group!";
  }

  await conn.sendMessage(
    m.chat,
    {
      text,
      mentions: groupUsers.map(u => u.id)
    },
    { quoted: m }
  );
};

handler.command = ['topblasphemy', 'blasphemytop'];
handler.group = true;
export default handler;