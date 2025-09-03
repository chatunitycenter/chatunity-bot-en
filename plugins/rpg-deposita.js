let handler = async (m, { args }) => {
  let user = global.db.data.users[m.sender];

  // Initialize default values if they don't exist
  if (typeof user.bank !== 'number') user.bank = 0;
  if (typeof user.limit !== 'number') user.limit = 0;

  if (!args[0]) return m.reply('🚩 Please enter the amount to deposit.');
  if (args[0] < 1) return m.reply('🚩 Are you stupid? Enter a valid amount!');

  if (args[0] === 'all') {
    let count = parseInt(user.limit);
    if (count <= 0) return m.reply('🚩 You do not have enough units to deposit.');
    user.limit -= count;
    user.bank += count;
    await m.reply(`🚩 Congratulations! You have deposited ${count} 💶 units into your bank.`);
    return;
  }

  if (isNaN(args[0])) return m.reply('🚩 The amount must be a number.');
  let count = parseInt(args[0]);

  if (user.limit <= 0) return m.reply('🚩 You have no units to deposit.');
  if (user.limit < count) return m.reply(`🚩 You only have ${user.limit} 💶 units to deposit.`);

  user.limit -= count;
  user.bank += count;
  await m.reply(`🚩 Finally! You have deposited ${count} 💶 units into your bank.`);
};

handler.help = ['deposit'];
handler.tags = ['rpg'];
handler.command = ['deposit', 'depo', 'dep', 'd'];
handler.register = true;
export default handler;
