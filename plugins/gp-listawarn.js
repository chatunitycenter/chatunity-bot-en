let handler = async (m, { conn, isOwner }) => {
  let warnedUsers = Object.entries(global.db.data.users).filter(user => user[1].warn);
  let warns = global.db.data.users.warn;
  let user = global.db.data.users;

  let mappedWarnings = warnedUsers.length
    ? await Promise.all(
        warnedUsers.map(async ([jid, user], i) => `
│
│ *${i + 1}.* ${await conn.getName(jid) || 'Unknown'} *(${user.warn}/3)*
│ ${isOwner ? '@' + jid.split`@`[0] : jid}
│ - - - - - - - - -`.trim())
      )
    : [];

  let caption = `⚠️ Warned Users
*╭•·–––––––––––––––––––·•*
│ *Total: ${warnedUsers.length} users*${mappedWarnings.length ? '\n' + mappedWarnings.join('\n') : ''}
*╰•·–––––––––––––––––––·•*\n\n⚠️ Warnings ⇢ ${warns ? `*${warns}/3*` : '*0/3*'}`;
  
  await conn.reply(m.chat, caption, m, { mentions: await conn.parseMention(caption) });
};

handler.help = ['warnlist'];
handler.tags = ['group'];
handler.command = ['listawarn', 'listwarn'];

export default handler;
