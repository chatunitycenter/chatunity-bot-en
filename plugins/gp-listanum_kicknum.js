let handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin }) => {
  if (!args[0]) return;
  if (isNaN(args[0])) return;

  let prefix = args[0].replace(/[+]/g, '');
  let matchingParticipants = participants
    .map(u => u.id)
    .filter(v => v !== conn.user.jid && v.startsWith(prefix || prefix));

  let botSettings = global.db.data.settings[conn.user.jid] || {};
  if (matchingParticipants.length === 0) return;

  let numbersList = matchingParticipants.map(v => '◉ @' + v.replace(/@.+/, ''));
  const delay = time => new Promise(res => setTimeout(res, time));

  switch (command) {
    case "listanum":
      conn.reply(m.chat, `List of +${prefix}:\n\n` + numbersList.join`\n`, m, { mentions: matchingParticipants });
      break;

    case "pulizia":
      if (!botSettings.restrict) return;
      if (!isBotAdmin) return;

      conn.reply(m.chat, `Starting cleanup of +${prefix}`, m);

      let groupOwner = m.chat.split`-`[0] + '@s.whatsapp.net';
      let usersToKick = participants
        .map(u => u.id)
        .filter(v => v !== conn.user.jid && v.startsWith(prefix || prefix));

      for (let user of usersToKick) {
        let message = `@${user.split("@")[0]} has been removed`;

        if (
          user !== groupOwner &&
          user !== conn.user.jid &&
          user !== global.owner + '@s.whatsapp.net' &&
          user !== isSuperAdmin &&
          user.startsWith(prefix || prefix) &&
          isBotAdmin &&
          botSettings.restrict
        ) {
          await delay(500);
          let response = await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
          if (response[0].status === "404") await delay(500);
        } else return;
      }
      break;
  }
};

handler.command = /^(listanum|kicknum|pulizia)$/i;
handler.group = handler.botAdmin = handler.admin = true;
handler.fail = null;

export default handler;
