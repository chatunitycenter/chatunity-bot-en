let handler = async (m, { conn, command, text, usedPrefix }) => {
  let target = text ? text.replace(/[@]/g, '') + '@s.whatsapp.net' : (m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0]);
  if (!target) return;

  if (command == 'negro' || command == 'nero') {
      let name = await conn.getName(target);
      conn.reply(m.chat, `
      @${target.split('@')[0]} è ⚫ ${(Math.floor(Math.random() * 100) + 1)}% ${command.toUpperCase()}
      `.trim(), null, {
          mentions: [target]
      });
  }
}

handler.help = ['negro', 'nero'].map(v => v + ' @tag | nome')
handler.tags = ['calcolatrice']
handler.command = /^nigger|nigga$/i

export default handler
