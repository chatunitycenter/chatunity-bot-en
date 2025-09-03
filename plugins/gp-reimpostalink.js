let handler = async (m, { conn }) => {
    let botName = global.db.data.botName || `𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲`;
    let revoke = await conn.groupRevokeInvite(m.chat);
    
    await conn.sendMessage(m.chat, {
      text: `🔹️ *link reset*\n♾ • ID: ${'https://chat.whatsapp.com/' + revoke}`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363259442839354@newsletter',
          serverMessageId: '',
          newsletterName: `${botName}`
        }
      }
    });
}
  
handler.command = ['reset', 'revoke'];
handler.botAdmin = true;
handler.admin = true;
handler.group = true;
  
export default handler;
