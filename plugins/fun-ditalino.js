import { performance } from "perf_hooks";

// Function to pick random element from array
function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

let handler = async (m, { conn, text }) => {
    let targetUser;

    // If replying to a message
    if (m.quoted && m.quoted.sender) {
        targetUser = m.quoted.sender;
    }
    // If users are mentioned
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetUser = m.mentionedJid[0];
    }
    // If nothing specified
    else {
        return m.reply("Tag someone or reply to a message to start the action.");
    }

    let targetName = `@${targetUser.split('@')[0]}`;

    // Custom messages
    let sequence = [
        `🤟🏻 Starting action for *${targetName}*...`,
        "🤟🏻 Almost there...",
        "👋🏻 Brace yourselves!!"
    ];

    // Send messages one by one
    for (let msg of sequence) {
        await m.reply(msg, null, { mentions: [targetUser] });
    }

    // Calculate time
    let startTime = performance.now();
    let endTime = performance.now();
    let elapsedTime = (endTime - startTime).toFixed(2);

    let resultMessage = `✨ *${targetName}* finished🥵! Action completed in *${elapsedTime}ms*!`;

    conn.reply(m.chat, resultMessage, m, { mentions: [targetUser] });
};

handler.command = ["action"];
handler.tags = ["fun"];
export default handler;
