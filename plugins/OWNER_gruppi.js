//Plugins By Gabs

const handler = async (m, { conn }) => {
  const user = global.db.data.users;
  let txt = `𝐋𝐈𝐒𝐓 𝐎𝐅 ${nomebot}'𝐒 𝐆𝐑𝐎𝐔𝐏𝐒`;
  const fkontak = { 
    "key": { 
      "participants": "0@s.whatsapp.net", 
      "remoteJid": "status@broadcast", 
      "fromMe": false, 
      "id": "Halo" 
    }, 
    "message": { 
      "contactMessage": { 
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD` 
      } 
    }, 
    "participant": "0@s.whatsapp.net" 
  };

  const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);
  const groupsSortedByMessages = [...groups].sort((a, b) => {
    const groupMessagesA = db.data.chats[a[0]]?.messaggi || 0;
    const groupMessagesB = db.data.chats[b[0]]?.messaggi || 0;
    return groupMessagesB - groupMessagesA;
  });

  txt += `\n\n➣ 𝐓𝐨𝐭𝐚𝐥 𝐆𝐫𝐨𝐮𝐩𝐬: ${groupsSortedByMessages.length}\n\n══════ ೋೋ══════\n`;

  for (let i = 0; i < groupsSortedByMessages.length; i++) {
    const [jid, chat] = groupsSortedByMessages[i];
    
    let groupMetadata = {};
    try {
      groupMetadata = ((conn.chats[jid] || {}).metadata || await conn.groupMetadata(jid)) || {};
    } catch {}
    const participants = groupMetadata.participants || [];
    const bot = participants.find((u) => conn.decodeJid(u.id) === conn.user.jid) || {};
    const isBotAdmin = bot?.admin || false;
    const totalParticipants = participants.length;

    // Get group name
    let groupName = 'Name not available';
    try {
      groupName = await conn.getName(jid);
    } catch {}

    // Get group messages
    const groupMessages = db.data.chats[jid]?.messaggi || 0;
    
    // Get group invite link
    let groupInviteLink = 'Not an admin';
    if (isBotAdmin) {
      try {
        groupInviteLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(jid) || 'Error'}`;
      } catch {}
    }

    // Add information to the text
    txt += `➣ 𝐆𝐑𝐎𝐔𝐏 𝐍𝐔𝐌𝐁𝐄𝐑: ${i + 1}\n`;
    txt += `➣ 𝐆𝐑𝐎𝐔𝐏: ${groupName}\n`;
    txt += `➣ 𝐏𝐀𝐑𝐓𝐈𝐂𝐈𝐏𝐀𝐍𝐓𝐒: ${totalParticipants}\n`;
    // Add more info as needed, e.g. messages, link, etc.
  }

  // Send the message (add the rest of your code as needed)
};

export default handler;
