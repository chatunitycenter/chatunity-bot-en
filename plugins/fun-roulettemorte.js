import { delay } from '@whiskeysockets/baileys';

const rouletteRooms = {};

const handler = async (m, { conn, usedPrefix, command }) => {
    const chatId = m.chat;
    const senderId = m.sender;

    if (rouletteRooms[chatId]) 
        return conn.reply(m.chat, '✧ There is already an active roulette game in this group. Please wait for it to end.', m);

    rouletteRooms[chatId] = { players: [senderId], status: 'waiting' };

    await conn.sendMessage(m.chat, { 
        text: `✦ *Death Roulette* ✦\n\n@${senderId.split('@')[0]} has created a game room.\n\n❀ Press the button below to join! (60 seconds)`,
        mentions: [senderId],
        buttons: [
            { buttonId: `${usedPrefix}${command} accept`, buttonText: { displayText: "✅ Accept the challenge" }, type: 1 },
            { buttonId: `${usedPrefix}${command} cancel`, buttonText: { displayText: "❌ Cancel" }, type: 1 }
        ]
    }, { quoted: m });

    await delay(60000);
    if (rouletteRooms[chatId] && rouletteRooms[chatId].status === 'waiting') {
        delete rouletteRooms[chatId];
        await conn.sendMessage(m.chat, { text: '✦ No one joined the game. The room has been closed.' });
    }
};

handler.command = ['deathroulette'];
handler.botAdmin = true;

export default handler;

handler.before = async (m, { conn, usedPrefix, command, args }) => {
    const chatId = m.chat;
    const senderId = m.sender;
    const lowerText = (m.text || '').toLowerCase();

    if (!rouletteRooms[chatId]) return;

    const arg = args && args[0] ? args[0].toLowerCase() : null;

    // Accepting the challenge
    if (lowerText === 'accept' || lowerText === 'join' || arg === 'accept') {
        if (rouletteRooms[chatId].players.length >= 2) 
            return conn.reply(m.chat, '✧ There are already two players in this room.', m);

        if (senderId === rouletteRooms[chatId].players[0])
            return conn.reply(m.chat, '✧ You cannot accept your own challenge.', m);

        rouletteRooms[chatId].players.push(senderId);
        rouletteRooms[chatId].status = 'full';

        await conn.sendMessage(m.chat, { 
            audio: { url: "https://qu.ax/iwAmy.mp3" }, 
            mimetype: "audio/mp4", 
            ptt: true 
        });

        await conn.sendMessage(m.chat, { 
            text: '✦ *Death Roulette* ✦\n\n❀ The game room is full!\n\n> ✧ Choosing the loser...' 
        });

        const loadingMessages = [
            "《 █▒▒▒▒▒▒▒▒▒▒▒》10%\n- Calculating odds...",
            "《 ████▒▒▒▒▒▒▒▒》30%\n- Fate is being sealed...",
            "《 ███████▒▒▒▒▒》50%\n- Destiny is being decided...",
            "《 ██████████▒▒》80%\n- The loser will be revealed soon!",
            "《 ████████████》100%\n- Final result!"
        ];

        let { key } = await conn.sendMessage(m.chat, { text: "✧ Calculating result..." }, { quoted: m });

        for (let msg of loadingMessages) {
            await delay(3000);
            await conn.sendMessage(m.chat, { text: msg, edit: key }, { quoted: m });
        }

        const [player1, player2] = rouletteRooms[chatId].players;
        const loser = Math.random() < 0.5 ? player1 : player2;

        await conn.sendMessage(m.chat, { 
            text: `✦ *Final Verdict* ✦\n\n@${loser.split('@')[0]} has been chosen as the loser.\n\n> ❀ You have 60 seconds for your last words...`, 
            mentions: [loser] 
        });

        await delay(60000);        
        await conn.groupParticipantsUpdate(m.chat, [loser], 'remove');
        await conn.sendMessage(m.chat, { 
            text: `❀ @${loser.split('@')[0]} has been removed. Game over.`, 
            mentions: [loser] 
        });        
        delete rouletteRooms[chatId];
    }

    // Cancelling the game
    if (lowerText === 'cancel' || arg === 'cancel') {
        if (senderId !== rouletteRooms[chatId].players[0]) return;
        delete rouletteRooms[chatId];
        await conn.sendMessage(m.chat, { text: '✧ The game has been cancelled by the creator.' });
    }
};
