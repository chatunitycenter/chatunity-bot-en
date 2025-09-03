const handler = async (m, {conn, usedprefix}) => {
    const who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    conn.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/blur', {
      avatar: await conn.profilePictureUrl(who, 'image').catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
  }), 'blurcard.png', '✨ It has been used!!\nChatUnity', m);
};
handler.help = ['blur'];
handler.tags = ['maker'];
handler.command = /^(blur)$/i;
export default handler;
