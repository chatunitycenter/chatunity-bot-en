const setAgeHandler = async (m, { conn, command, text }) => {
  const who = m.sender;

  if (command === 'setage') {
    const age = parseInt(text);
    if (!age || isNaN(age) || age < 10 || age > 80) {
      return conn.reply(m.chat, `Use .setage or .delage\n> Enter a valid age.\n> Valid age is from 10 to 80 years.`, m);
    }

    global.db.data.users[who].age = age;
    conn.reply(m.chat, `✓ Age set to: ${age} years.`, m);
  }

  if (command === 'delage') {
    delete global.db.data.users[who].age;
    conn.reply(m.chat, `✓ Age removed.`, m);
  }
};

setAgeHandler.command = /^(setage|delage)$/i;
export default setAgeHandler;