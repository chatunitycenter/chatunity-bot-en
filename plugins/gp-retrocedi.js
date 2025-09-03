let handler = async (m, { conn, usedPrefix, text }) => {
  if (isNaN(text) && !text.match(/@/g)) {
    // Do nothing if text is not a number and does not contain '@'
  } else if (isNaN(text)) {
    // If text is not a number, extract number after '@'
    var number = text.split`@`[1];
  } else if (!isNaN(text)) {
    // If text is a number, assign directly
    var number = text;
  }

  if (!text && !m.quoted) return;
  if (number.length > 13 || (number.length < 11 && number.length > 0)) return;

  try {
    if (text) {
      var user = number + '@s.whatsapp.net';
    } else if (m.quoted.sender) {
      var user = m.quoted.sender;
    } else if (m.mentionedJid) {
      var user = number + '@s.whatsapp.net';
    }
  } catch (e) {
    // Ignore errors silently
  } finally {
    conn.groupParticipantsUpdate(m.chat, [user], 'demote');
  }
};

handler.help = ['*593xxx*', '*@username*', '*reply chat*'].map(v => 'demote ' + v);
handler.tags = ['group'];
handler.command = /^(r|demote|removeadmin|r)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
