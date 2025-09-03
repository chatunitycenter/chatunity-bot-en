let handler = async (m, { conn, command, text }) => {
    // Generate random sobriety level
    let level = Math.floor(Math.random() * 101);

    // Determine message based on level
    let finalPhrase = level >= 70 
        ? "🌿 Watch out, they'd even snort flour" 
        : level >= 30 
        ? "🌿 Can't handle their stuff, needs higher doses!!" 
        : "🌿 A role model to follow, congratulations.";

    // Create message
    let message = `
『💬』 ══ •⊰✰⊱• ══ 『💬』

TIME FOR THE SOBRIETY TEST! 🌿 
━━━━━━━━━━━━━━
 ${text ? text : 'You'} have a sobriety level of ${level}%! 🌿
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

handler.command = /^(sober|sobriety|clean)$/i;

export default handler;
