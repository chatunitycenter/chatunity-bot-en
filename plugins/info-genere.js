const setGenderHandler = async (m, { conn, command, text }) => {
  const who = m.sender;

  if (command === 'setgender') {
    if (!text || !['male', 'female'].includes(text.toLowerCase())) {
      return conn.reply(m.chat, `Correct usage:\n.setgender male / .setgender female`, m);
    }

    const emoji = text.toLowerCase() === 'male' ? '🚹' : '🚺';
    global.db.data.users[who].gender = text.trim().toLowerCase();
    conn.reply(m.chat, `✓ Gender set as: ${text.trim().toLowerCase()} ${emoji}`, m);
  }

  if (command === 'deletegender') {
    delete global.db.data.users[who].gender;
    conn.reply(m.chat, `Gender removed ✓`, m);
  }
}

setGenderHandler.command = /^(setgender|deletegender)$/i;
export default setGenderHandler;