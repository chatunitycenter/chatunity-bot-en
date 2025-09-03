let handler = async (m, { conn, command, text }) => {
    const specialJoker = '639318481412@s.whatsapp.net';
    if (!text) return conn.reply(m.chat, "🤔 *Missing the name!* \nUse: `.cheat @name` or ask matte😈😈", m);

    if (m.sender === specialJoker) {
        let trollText = `🤣 *WELL, HERE'S THE KING OF CHEATERS!* 🤣\nThey say if he takes off his horns he could get 5G signal📡💀`;
        await conn.sendMessage(m.chat, {
            text: trollText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363259442839354@newsletter',
                    newsletterName: '👑 *Official Cheaters Club* 👑'
                }
            },
            mentions: conn.parseMention(trollText)
        }, { quoted: m });
        return;
    }

    let percent = Math.floor(Math.random() * 101);
    let message = "";

    if (percent < 30) {
        message = "🛡️ *All clear... for now!*";
    } else if (percent < 70) {
        message = "😬 *Hmm... some suspicions here!*";
    } else if (percent < 90) {
        message = "👀 *Cheat-o-meter on alert! Watch your back!*";
    } else {
        message = "🫣 *NATIONAL LEVEL! WE'RE TALKING CHEATER OF THE YEAR!*";
    }

    let response = `🔍 *CHEAT DETECTOR* 🔍

👤 *${text}*
📈 *Cheat Level:* *${percent}%*
${message}

${percent > 75 ? "🔔 *Advice: Never turn your back!* 🤣" : "😌 *Breathe, it could be worse...*"}
    `.trim();

    await conn.sendMessage(m.chat, {
        text: response,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                newsletterName: '👑 *Official Cheaters Club* 👑'
            }
        },
        mentions: conn.parseMention(response)
    }, { quoted: m });
};

handler.help = ['cheat @name'];
handler.tags = ['fun'];
handler.command = /^(cheat|cheater|cheating)$/i;
handler.fail = "❗ Write a name, example: `.cheat @user`";

export default handler;
