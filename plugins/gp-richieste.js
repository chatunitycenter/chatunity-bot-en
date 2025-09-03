let pendingRequests = {};

let handler = async (m, { conn, isAdmin, isBotAdmin, args, usedPrefix, command }) => {
  if (!m.isGroup) return;

  const groupId = m.chat;

  if (pendingRequests[m.sender]) {
    const pending = await conn.groupRequestParticipantsList(groupId);
    const input = (m.text || '').trim();
    delete pendingRequests[m.sender];

    if (/^\d+$/.test(input)) {
      const number = parseInt(input);
      if (number <= 0) return m.reply("❌ Numero non valido. Usa un numero > 0.");
      const toApprove = pending.slice(0, number);
      try {
        const jidList = toApprove.map(p => p.jid);
        await conn.groupRequestParticipantsUpdate(groupId, jidList, 'approve');
        return m.reply(`✅ Approvate ${jidList.length} richieste.`);
      } catch {
        return m.reply("❌ Errore durante l'approvazione.");
      }
    }

    if (input === '39' || input === '+39') {
      const toApprove = pending.filter(p => p.jid.startsWith('39') || p.jid.startsWith('+39'));
      if (!toApprove.length) return m.reply("❌ Nessuna richiesta con prefisso +39 trovata.");
      try {
        const jidList = toApprove.map(p => p.jid);
        await conn.groupRequestParticipantsUpdate(groupId, jidList, 'approve');
        return m.reply(`✅ Approvate ${jidList.length} richieste con prefisso +39.`);
      } catch {
        return m.reply("❌ Errore durante l'approvazione.");
      }
    }

    return m.reply("❌ Input non valido. Invia un numero o '39'.");
  }

  if (!isBotAdmin) return m.reply("❌ Devo essere admin per gestire le richieste.");
  if (!isAdmin) return m.reply("❌ Solo gli admin del gruppo possono usare questo comando.");

  const pending = await conn.groupRequestParticipantsList(groupId);
  if (!pending.length) return m.reply("✅ Nessuna richiesta in sospeso.");

  if (!args[0]) {
    return conn.sendMessage(m.chat, {
      text: `📨 Richieste in sospeso: ${pending.length}\nSeleziona un'opzione:`,
      footer: 'Gestione Richieste Gruppo',
      buttons: [
        { buttonId: `${usedPrefix}${command} accept`, buttonText: { displayText: "✅ Approva tutte" }, type: 1 },
        { buttonId: `${usedPrefix}${command} reject`, buttonText: { displayText: "❌ Rifiuta tutte" }, type: 1 },
        { buttonId: `${usedPrefix}${command} accept39`, buttonText: { displayText: "🇮🇹 Approva +39" }, type: 1 },
        { buttonId: `${usedPrefix}${command} manage`, buttonText: { displayText: "📥 Gestisci richieste" }, type: 1 }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });
  }

  if (args[0] === 'accept') {
    const number = parseInt(args[1]);
    const toApprove = isNaN(number) || number <= 0 ? pending : pending.slice(0, number);
    try {
      const jidList = toApprove.map(p => p.jid);
      await conn.groupRequestParticipantsUpdate(groupId, jidList, 'approve');
      return m.reply(`✅ Approvate ${jidList.length} richieste.`);
    } catch {
      return m.reply("❌ Errore durante l'approvazione.");
    }
  }

  if (args[0] === 'reject') {
    try {
      const jidList = pending.map(p => p.jid);
      await conn.groupRequestParticipantsUpdate(groupId, jidList, 'reject');
      return m.reply(`❌ Rifiutate ${jidList.length} richieste.`);
    } catch {
      return m.reply("❌ Errore durante il rifiuto.");
    }
  }

  if (args[0] === 'accept39') {
    const toApprove = pending.filter(p => p.jid.startsWith('39') || p.jid.startsWith('+39'));
    if (!toApprove.length) return m.reply("❌ Nessuna richiesta con prefisso +39 trovata.");
    try {
      const jidList = toApprove.map(p => p.jid);
      await conn.groupRequestParticipantsUpdate(groupId, jidList, 'approve');
      return m.reply(`✅ Approvate ${jidList.length} richieste con prefisso +39.`);
    } catch {
      return m.reply("❌ Errore durante l'approvazione.");
    }
  }

  if (args[0] === 'manage') {
    return conn.sendMessage(m.chat, {
      text: `📥 Quante richieste vuoi approvare?\n\nScegli una quantità tra quelle sotto o digita manualmente:\n\n*.${command} accept <numero>*\nEsempio: *.${command} accept 7*`,
      footer: 'Gestione Richieste Personalizzata',
      buttons: [
        { buttonId: `${usedPrefix}${command} accept 10`, buttonText: { displayText: "10" }, type: 1 },
        { buttonId: `${usedPrefix}${command} accept 20`, buttonText: { displayText: "20" }, type: 1 },
        { buttonId: `${usedPrefix}${command} accept 50`, buttonText: { displayText: "50" }, type: 1 },
        { buttonId: `${usedPrefix}${command} accept 100`, buttonText: { displayText: "100" }, type: 1 },
        { buttonId: `${usedPrefix}${command} accept 200`, buttonText: { displayText: "200" }, type: 1 },
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });
  }
};

handler.command = ['requests'];
handler.tags = ['group'];
handler.help = ['requests'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.limit = false;

export default handler;
