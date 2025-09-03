const pinQueue = new Map();

let handler = async (m, { conn, command, usedPrefix }) => {
    if (command === 'pin') {
        if (!m.quoted) return m.reply(`⚠️ Reply to a message to pin it.`);

        
        pinQueue.set(m.chat, m.quoted);

        const buttons = [
            { buttonId: `${usedPrefix}pin1d`, buttonText: { displayText: '⏳ 1 Day' }, type: 1 },
            { buttonId: `${usedPrefix}pin7d`, buttonText: { displayText: '⏳ 7 Days' }, type: 1 },
            { buttonId: `${usedPrefix}pin30d`, buttonText: { displayText: '⏳ 30 Days' }, type: 1 },
        ];

        await conn.sendMessage(m.chat, {
            text: 'Choose how long you want to pin the message:',
            buttons,
            headerType: 1
        });
        return;
    }

    if (['pin1d', 'pin7d', 'pin30d'].includes(command)) {
        const quoted = pinQueue.get(m.chat);
        if (!quoted) return m.reply('❌ No message to pin. Use the pin command first by replying to a message.');

        const messageKey = {
            remoteJid: m.chat,
            fromMe: quoted.fromMe,
            id: quoted.id,
            participant: quoted.sender
        };

        let durationMs = 0;
        if (command === 'pin1d') durationMs = 1 * 24 * 60 * 60 * 1000;
        else if (command === 'pin7d') durationMs = 7 * 24 * 60 * 60 * 1000;
        else if (command === 'pin30d') durationMs = 30 * 24 * 60 * 60 * 1000;

        try {
            await conn.sendMessage(m.chat, { pin: { key: messageKey, type: 1 } });

            m.react('✅️');

            pinQueue.delete(m.chat);
        } catch (e) {
            console.error(e);
            m.reply('❌ Error pinning message.');
        }
        return;
    }

    if (['unpin', 'destacar', 'desmarcar'].includes(command)) {
        if (!m.quoted) return m.reply(`⚠️ Reply to a message to ${command === 'unpin' ? 'unpin it' : 'perform the action'}.`);

        const messageKey = {
            remoteJid: m.chat,
            fromMe: m.quoted.fromMe,
            id: m.quoted.id,
            participant: m.quoted.sender
        };

        try {
            switch (command) {
                case 'unpin':
                    await conn.sendMessage(m.chat, { pin: { key: messageKey, type: 2 } });
                    break;
                case 'destacar':
                    await conn.sendMessage(m.chat, { keep: { key: messageKey, type: 1 } });
                    break;
                case 'desmarcar':
                    await conn.sendMessage(m.chat, { keep: { key: messageKey, type: 2 } });
                    break;
            }
            m.react('✅️');
        } catch (err) {
            console.error('[ERROR]', err);
            m.reply('❌ Error executing command.');
        }
        return;
    }
};

handler.help = ['pin'];
handler.tags = ['group'];
handler.command = ['pin', 'unpin', 'destacar', 'desmarcar', 'pin1d', 'pin7d', 'pin30d'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
