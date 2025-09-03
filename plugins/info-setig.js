const handler = async (m, { conn, usedPrefix }) => {
  const sender = m.sender;
  const userData = global.db.data.users[sender];

  if (!userData) {
    return conn.reply(m.chat, 'Error: Specified user not found.', m);
  }

  // Command to delete Instagram
  if (/^(\D|_)?deleteig/i.test(m.text)) {
    if (!userData.instagram) {
      return conn.reply(
        m.chat,
        `ⓘ Make sure to set your Instagram username with ${usedPrefix}setig before continuing.`,
        null,
        { quoted: m }
      );
    }

    userData.instagram = undefined;
    return conn.reply(
      m.chat,
      'ⓘ Instagram username successfully removed from your user profile.',
      null,
      { quoted: m }
    );
  }

  // Command to set Instagram
  if (/^(\D|_)?setig/i.test(m.text)) {
    const parts = m.text.trim().split(' ');
    const instaName = parts[1];

    if (!instaName) {
      return conn.reply(
        m.chat,
        'ⓘ Use .setig <username> to set Instagram or .deleteig to remove it.',
        null,
        { quoted: m }
      );
    }

    userData.instagram = instaName.toLowerCase();
    return conn.reply(
      m.chat,
      `ⓘ You have successfully set your Instagram username as *${userData.instagram}*`,
      null,
      { quoted: m }
    );
  }
};

handler.command = /^(setig|deleteig)$/i;
export default handler;