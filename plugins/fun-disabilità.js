let handler = async (m, { conn, command, text, usedPrefix }) => {
    let target = text ? text.replace(/[@]/g, '') + '@s.whatsapp.net' : (m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0]);
    if (!target) return conn.reply(m.chat, `🚨 *TAG SOMEONE, DAMN IT!* 🚨\nExample: *${usedPrefix}${command} @yourbestfriend*`, m);

    let name = await conn.getName(target);
    let randomPercent = Math.floor(Math.random() * 100) + 1;

    // Sarcastic and ruthless phrases
    let sharpPhrases = [
        `🧠 *Their IQ? As stable as Bitcoin in 2018.* 📉`,  
        `💡 *If ignorance were light, they'd be a lighthouse.* 🌟`,  
        `🏆 *Olympic champion of "Huh?" and "What?"* 🥇`,  
        `🦉 *Zero wisdom, but at least they're nice... right?* 🙃`,  
        `🌌 *Their mind? A cosmic void.* 🚀`,  
        `📚 *If stupidity were a book, they'd be an encyclopedia.* 📖`,  
        `🛠️ *They have two neurons and they're fighting for third place.* ⚡`,  
        `🎭 *They talk a lot but always say... nothing.* 🤡`
    ];

    let randomPhrase = sharpPhrases[Math.floor(Math.random() * sharpPhrases.length)];

    // Final message SHOOTS TO KILL
    let finalMessage = `
⚡ *📜 OFFICIAL VERDICT OF "${command.toUpperCase()}" 📜* ⚡

🧑 *Analyzed Subject:* ${name}  
📉 *Level of "${command}":* ${randomPercent}% ${randomPercent > 80 ? "☠️ *SERIOUS SOCIAL DANGER* ☠️" : "🤏 *Almost acceptable... almost*"}  

${randomPhrase}  

${randomPercent > 90 ? 
    "🚨 *WARNING:* Their presence may cause loss of brain cells. Use with caution." : 
    randomPercent < 20 ? 
    "🦸 *Miracle! They can breathe and think at the same time!*" : 
    "💀 *You'll survive... maybe.*"
}  

💥 *CONCLUSION:* ${randomPercent > 70 ? 
    "*Natural selection has failed.*" : 
    "*Could be useful as an example of what not to do.*"
}`.trim();

    await conn.sendMessage(m.chat, { 
        text: finalMessage,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                newsletterName: '🔥 *VERDICT SHOOTING GALLERY* 🔥'
            }
        },
        mentions: [target]
    }, { quoted: m });
};

handler.help = ['stupid', 'idiot', 'moron', 'dumb', 'retarded'].map(v => v + ' @tag | name');
handler.tags = ['satire', 'game'];
handler.command = /^(stupid|idiot|moron|dumb|retarded)$/i;

export default handler;
