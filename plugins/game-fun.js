const gameSessions = {};
let cooldowns = {};

let handler = async (m, { conn, text, command, usedPrefix }) => {
    const waitTime = 5; // seconds

    // Cooldown
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < waitTime * 1000) {
        let timeRemaining = secondsToHMS(Math.ceil((cooldowns[m.sender] + waitTime * 1000 - Date.now()) / 1000));
        return m.reply(`⏳ You already played recently. Wait *${timeRemaining}* before trying again.`);
    }

    if (!text || ['heads', 'tails'].includes(text.toLowerCase())) {
        if (!gameSessions[m.chat]) {
            if (!text) {
                return conn.sendMessage(m.chat, {
                    text: `🎮 *Heads or Tails*\n\n🧑 Player 1: @${m.sender.split('@')[0]}\n🕹️ Waiting for second player...\n\nType "heads" or "tails" to start.`,
                    footer: 'Make your choice',
                    mentions: [m.sender],
                    headerType: 1
                }, { quoted: m });
            }

            gameSessions[m.chat] = {
                player1: m.sender,
                choice1: text.toLowerCase(),
                player2: null,
                choice2: null,
                status: 'waiting'
            };

            return conn.sendMessage(m.chat, {
                text: `🎮 *Heads or Tails*\n\n🧑 Player 1: @${m.sender.split('@')[0]} chose *${text.toLowerCase()}*\n🎯 Waiting for another player...\n\nYour turn! Type "heads" or "tails".`,
                footer: 'Join now',
                mentions: [m.sender],
                headerType: 1
            }, { quoted: m });
        } else {
            let session = gameSessions[m.chat];

            if (session.status === 'waiting' && m.sender !== session.player1) {
                if (!['heads', 'tails'].includes(text.toLowerCase())) {
                    return conn.sendMessage(m.chat, {
                        text: `⚠️ You must choose between *heads* or *tails*! Type your choice.`,
                        footer: 'Select heads or tails',
                        headerType: 1
                    }, { quoted: m });
                }

                session.player2 = m.sender;
                session.choice2 = text.toLowerCase();
                session.status = 'ready';

                const result = Math.random() < 0.5 ? 'heads' : 'tails';
                const winner1 = session.choice1 === result;
                const winner2 = session.choice2 === result;

                let message = `🪙 *RESULT: ${result.toUpperCase()}*\n\n`;

                if (winner1) {
                    global.db.data.users[session.player1].limit += 500;
                    message += `✅ @${session.player1.split('@')[0]} won 500 💶\n`;
                } else {
                    global.db.data.users[session.player1].limit -= 250;
                    message += `❌ @${session.player1.split('@')[0]} lost 250 💶\n`;
                }

                if (winner2) {
                    global.db.data.users[session.player2].limit += 500;
                    message += `✅ @${session.player2.split('@')[0]} won 500 💶\n`;
                } else {
                    global.db.data.users[session.player2].limit -= 250;
                    message += `❌ @${session.player2.split('@')[0]} lost 250 💶\n`;
                }

                conn.sendMessage(m.chat, {
                    text: message + `\n\nTo play again type the command ${usedPrefix + command}`,
                    mentions: [session.player1, session.player2],
                    footer: 'Play again',
                    headerType: 1
                }, { quoted: m });

                cooldowns[session.player1] = Date.now();
                cooldowns[session.player2] = Date.now();
                delete gameSessions[m.chat];
                return;
            }

            if (session.status === 'waiting' && m.sender === session.player1) {
                return m.reply(`You already chose *${session.choice1}*. Waiting for another player...`);
            }

            return conn.sendMessage(m.chat, {
                text: '❌ Game not available or invalid command.\n\nTo start a new game type the command ' + usedPrefix + command,
                footer: 'Start a new game',
                headerType: 1
            }, { quoted: m });
        }
    }

    return conn.sendMessage(m.chat, {
        text: '❌ Invalid command. Type "' + usedPrefix + command + '" or choose "heads" or "tails".',
        footer: 'Start a new game',
        headerType: 1
    }, { quoted: m });
};

function secondsToHMS(seconds) {
    return `${seconds % 60} seconds`;
}

handler.help = ['coinflip'];
handler.tags = ['game'];
handler.command = ['cf', 'flip', 'coin'];
handler.register = true;

export default handler;
