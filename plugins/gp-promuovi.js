let handler = async (m, { conn, usedPrefix, text }) => {
  // Check if text is not a number and does not contain '@'
  if (isNaN(text) && !text.match(/@/g)) {
    // Do nothing in this case
  } else if (isNaN(text)) {
    // If text is not a number, extract the number after '@'
    var number = text.split`@`[1];
  } else if (!isNaN(text)) {
    // If text is a number, assign it directly to number
    var number = text;
  }

  // Return if no text and no quoted message
  if (!text && !m.quoted) return;

  // Return if number length is invalid (more than 13 or between 1 and 10)
  if (number.length > 13 || (number.length < 11 && number.length > 0)) return;

  try {
    if (text) {
      var user = number + '@s.whatsapp.net';  // Construct user ID if text exists
    } else if (m.quoted.sender) {
      var user = m.quoted.sender;             // Use sender of quoted message
    } else if (m.mentionedJid) {
      var user = number + '@s.whatsapp.net';  // Use mentioned JID
    }
  } catch (e) {
    // Handle any errors silently
  } finally {
    // Promote user to admin in the group
    conn.groupParticipantsUpdate(m.chat, [user], 'promote');
  }
}

handler.command = /^(p|promote|makeadmin|p)$/i;  // Commands that trigger this handler
handler.group = true;      // Only in groups
handler.admin = true;      // Only admins can use
handler.botAdmin = true;   // Bot must be admin
handler.fail = null;       // No failure handler
export default handler;
