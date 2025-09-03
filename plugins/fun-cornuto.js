let handler = async (m, { conn, command, text }) => {
    const specialJoker = '639318481412@s.whatsapp.net';

    // If no text, try to get name/id from quoted message
    let targetText = text;
    if (!targetText && m.quoted) {
        targetText = m.quoted.sender ? '@' + m.quoted.sender.split('@')[0] : m.quoted.text || '';
    }
    if (!targetText) return conn.reply(m.chat, "🤔 Missing the name! \nUse it like: .cheater @name or reply to a message", m);

    if (m.sender === specialJoker) {
        let trollText = "🤣 *BEHOLD, THE KING OF CHEATERS!* 🤣\nThey say if he takes off his horns he could be a 5G antenna📡💀";
        await conn.sendMessage(m.chat, {
            text: trollText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363259442839354@newsletter',
                    newsletterName: '👑 Official Cheaters Club 👑'
                }
            },
            mentions: conn.parseMention(trollText)
        }, { quoted: m });
        return;
    }

    let percent = Math.floor(Math.random() * 101);
    let message = "";

    if (percent < 30) {
        message = "🛡 Everything seems fine... for now!";
    } else if (percent < 70) {
        message = "😬 Hmm... some suspicions here!";
    } else if (percent < 90) {
        message = "👀 Cheater radar activated! Watch your back!";
    } else {
        message = "🫣 NATIONAL LEVEL! WE'RE TALKING ABOUT A PROFESSIONAL CHEATER!";
    }

    let response = `🔍 CHEATER CALCULATOR 🔍

👤 ${targetText}
📈 Cheater Level: ${percent}%
${message}

${percent > 75 ? "🔔 Advice: Never turn your back! 🤣" : "😌 Breathe, it could be worse..."}
    `.trim();

    await conn.sendMessage(m.chat, {
        text: response,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                newsletterName: '👑 Official Cheaters Club 👑'
            }
        },
        mentions: conn.parseMention(response)
    }, { quoted: m });
};

handler.help = ['cheater @name'];
handler.tags = ['fun'];
handler.command = /^(cheater|cheating|cheat)$/i;
handler.fail = "❗ Write a name, example: .cheater @user";

export default handler;
