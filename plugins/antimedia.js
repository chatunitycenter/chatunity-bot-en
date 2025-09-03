// antimedia by Onix, by Riad
export async function before(m, { conn }) {
    if (!m.isGroup || m.isBaileys) return true;

    const chat = global.db.data.chats[m.chat];
    if (!chat.antimedia) return true;

    const msg = m.msg || {};
    const type = m.mtype || '';

    // bot excluded
    if (m.sender === conn.user.jid) return true;

    // admins excluded
    const groupMetadata = await conn.groupMetadata(m.chat);
    const admins = groupMetadata.participants
        .filter(p => p.admin)
        .map(p => p.id);

    if (admins.includes(m.sender)) return true;

    if (['imageMessage', 'videoMessage'].includes(type)) {
        const isViewOnce = msg?.[type]?.viewOnce;
        const isGif = msg?.videoMessage?.gifPlayback;

        if (!isViewOnce || isGif) {
            // Delete the message
            await conn.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: m.key.participant || m.sender
                }
            });

            // Warning message
            await conn.sendMessage(m.chat, {
                text: `> ⚠️ 𝐀𝐍𝐓𝐈𝐌𝐄𝐃𝐈𝐀 𝐄𝐍𝐀𝐁𝐋𝐄𝐃 ⚠️\nOnly view-once photos and videos are allowed.`,
                mentions: [m.sender]
            });
        }
    }

    return true;
                }
