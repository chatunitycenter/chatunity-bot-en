let handler = async (m, { conn }) => {
  let guideMessage = `
GUIDE TO chatunity-bot-en COMMANDS

\`GOOGLE DOCS LINK:\`
https://docs.google.com/document/d/e/2PACX-1vSgfwbRZrQM2W-3tctvqX7_0eAF-FvU3K_SK8txRfGkNzJjziAIVV8G2EIMg4Ju03TlGIzMKaicjWTH/pub
`.trim();

  let messageOptions = {
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363259442839354@newsletter',
        serverMessageId: '',
        newsletterName: 'ChatUnity Bot'
      }
    }
  };

  conn.reply(m.chat, guideMessage, m, messageOptions);
};

handler.help = ['guida'];
handler.tags = ['info'];
handler.command = /^(guide)$/i;

export default handler;
