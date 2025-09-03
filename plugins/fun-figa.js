let handler = async (m, { conn, command, text }) => {
    let width = Math.floor(Math.random() * 31);
    let finalPhrase = width >= 8 
        ? "🔥 Congratulations, impressive levels!"
        : "😅 Decent result, there's always room for improvement!";

    let message = `
━━━━━━━━━━━━━━━━
📏 SIZE CALCULATOR 📏
━━━━━━━━━━━━━━━━
🔍 ${text} has an estimated size of:  
👉 ${width} cm!  
━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    const messageOptions = {
        contextInfo: {
            forwardingScore: 0,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: `${conn.user.name}`
            }
        }
    };

    // Forward the generated message without replying to the command
    await conn.sendMessage(m.chat, { text: message, ...messageOptions });
};

handler.command = /^(pussy)$/i;

export default handler;
