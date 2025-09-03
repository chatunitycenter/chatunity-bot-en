let handler = async (m, { conn, usedPrefix }) => {
    let sizes = [
        "🟢 Small as an ant 🐜",
        "🔵 Normal, nothing special 😌",
        "🟠 Medium, a finger can pass 🖕",
        "🔴 Huge! A bottle can pass 🍾",
        "⚫ Destroyed, looks like a railway tunnel 🚇",
        "💥 You don't have a hole anymore, it exploded 💣"
    ];

    let randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    let message = "*Analyzing your hole...*\n\n📏 *Result:* " + randomSize;

    let forwardOptions = forward("ChatUnity");
    await conn.sendMessage(m.chat, { text: message, ...forwardOptions }, { quoted: m });
};

const forward = (botName) => {
    let messageOptions = {
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: `${botName}`
            }
        }
    };
    return messageOptions;
};

handler.command = ["ass", "holemeter"];
export default handler;
