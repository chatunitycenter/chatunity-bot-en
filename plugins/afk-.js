let handler = async (m, { text, args, usedPrefix, command, conn }) => { 
    let user = global.db.data.users[m.sender];
      
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else return m.reply(`Use: ${usedPrefix + command} <reason>`); // smsAfkQ1
    
    if (text.length < 10) return m.reply(`Please provide a longer reason for being AFK.`); // smsAfkQ2
    
    user.afk = + new Date;
    user.afkReason = text;
    await conn.reply(m.chat, `🔔 *AFK Activated* 🔔
*------------------------------*
Hey! @${m.sender.split("@")[0]} is now AFK.${text ? '\n👉 ' + text : ''}`, m, { mentions: [m.sender] }); // smsAvisoAG, smsAfkM1A, smsAfkM1B
}
    
handler.command = /^afk$/i;
handler.register = true;
export default handler;
