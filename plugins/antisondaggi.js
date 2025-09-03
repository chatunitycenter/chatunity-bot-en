// Script created by Riad, the Holy Father

export async function before(m, { isAdmin, isBotAdmin, conn }) {
    // Skip if message is not from a group or is a system (Baileys) message
    if (!m.isGroup || m.isBaileys) return true;

    // Check if anti-poll feature is enabled for this chat
    let chat = global.db.data.chats[m.chat];
    if (!chat.antisondaggi) return true;

    // Detect the poll type (varies depending on WhatsApp version)
    const pollType = Object.keys(m.message || {})[0];
    const isPoll = pollType === 'pollCreationMessageV3' ||
                   pollType === 'pollCreationMessage' ||
                   pollType === 'pollCreationMessageV2';

    // If a poll is detected and the sender is not an admin, delete the poll and notify the group
    if (isPoll && !isAdmin) {
        try {
            // Delete the poll message
            await conn.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: m.key.participant || m.sender
                }
            });

            // Notify the group about the deleted poll
            await conn.sendMessage(m.chat, {
                text: `> ⚠️ POLL DETECTED ⚠️\nThe poll created by @${m.sender.split('@')[0]} has been deleted.`,
                mentions: [m.sender]
            });
        } catch (error) {
            console.error('Error handling poll deletion:', error);
        }
    }

    return true;
}
