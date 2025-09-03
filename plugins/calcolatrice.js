let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) {
        if (m.quoted && m.quoted.sender) {
            text = '@' + m.quoted.sender.split('@')[0];
        } else {
            return conn.reply(m.chat, `⚠️ You must mention someone or reply to a message! Example: ${usedPrefix + command} @user`, m);
        }
    }

    let tag = text.replace(/[@]/g, '');
    let target = tag + '@s.whatsapp.net';
    let name = await conn.getName(target);
    let percentage = Math.floor(Math.random() * 100) + 1;

    // Customize responses for each command
    let responses = {
        'lesbica': {
            emoji: '🏳️‍🌈',
            messages: [
                `@${tag} is ${percentage}% lesbian! ${percentage > 80 ? 'Full sapphic mode!' : ''}`,
                `Test complete: @${tag} is ${percentage}% into women!`,
                `💕 @${tag} prefers women ${percentage}% of the time`
            ]
        },
        'pajero': {
            emoji: '✊💦',
            messages: [
                `@${tag} is ${percentage}% wanker! ${percentage > 80 ? 'Parental lock needed!' : ''}`,
                `Embarrassing result: @${tag} is ${percentage}% masturbator`,
                `🍆 @${tag} thinks about sex ${percentage}% of the time`
            ]
        },
        'puttana': {
            emoji: '🔞',
            messages: [
                `@${tag} is ${percentage}% whore! ${percentage > 80 ? 'How much do you charge?' : ''}`,
                `Full analysis: @${tag} is ${percentage}% in the world's oldest profession`,
                `💰 @${tag} has a price: ${percentage}% off today!`
            ]
        }
    };

    let cmd = command.toLowerCase();
    let response = responses[cmd] || {
        emoji: '❓',
        messages: [`@${tag} is ${percentage}% ${cmd}!`]
    };

    let randomMessage = response.messages[Math.floor(Math.random() * response.messages.length)];

    await conn.sendMessage(m.chat, {
        text: `${response.emoji} ${randomMessage}`,
        mentions: [target]
    }, { quoted: m });
};

handler.help = ['gay', 'lesbica', 'puttana', 'prostituta', 'prostituto']
    .map(v => v + ' @tag | name');
handler.tags = ['fun'];
handler.command = /^(lesbica|puttana|prostituta|prostituto)$/i;

export default handler;
