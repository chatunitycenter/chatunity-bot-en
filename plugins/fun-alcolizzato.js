let handler = async (m, { conn, command, text }) => {
    // Generate random blood alcohol level
    let level = Math.floor(Math.random() * 101);

    // Determine message based on level
    let finalPhrase = level >= 70 
        ? "🍾 Buddy if you need to talk, I'm here for you.." 
        : level >= 30 
        ? "🥂 Drinking responsibly, or almost..." 
        : "🚰 Completely sober, no drinks for today!";

    // Create message
    let message = `
『💬』 ══ •⊰✰⊱• ══ 『💬』

TIME FOR THE ALCOHOL TEST! 🍷 
━━━━━━━━━━━━━━
 ${text ? text : 'You'} have a blood alcohol level of ${level}%! 🍷
『💬』 ══ •⊰✰⊱• ══ 『💬』

${finalPhrase}
`.trim();

    const messageOptions = {
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: `ChatUnity` // Using botName variable
            },
        }
    };

    // Send message with mentions and options
    m.reply(message, null, { mentions: conn.parseMention(message), ...messageOptions });
};

handler.command = /^(drunk|alcohol)$/i;

export default handler;
