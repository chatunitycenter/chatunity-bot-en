let linkRegex = /vm\.tiktok\.com/i;
const WARN_LIMIT = 3;

export async function before(m, { isAdmin, groupMetadata, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    let chatData = global.db.data.chats[m.chat];
    let userWarnLimit = WARN_LIMIT;
    let participant = m.key.participant;
    let messageId = m.key.id;
    let botSettings = global.db.data.settings[this.user.jid] || {};

    const containsTikTokLink = linkRegex.test(m.text);
    const warnMessage = "*° WARNING";
    const removeMessage = "⛔ USER REMOVED AFTER 3 WARNINGS";
    const vcard = `BEGIN:VCARD
VERSION:5.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`;

    // Admins are not warned for TikTok links
    if (isAdmin && chatData.antitiktok && m.sender.includes("vm.tiktok.com")) return;

    // If antiTikTok is enabled, the message contains a TikTok link, the sender is not admin, and the bot is admin
    if (chatData.antitiktok && containsTikTokLink && !isAdmin && isBotAdmin) {
        // Increase user's warning count
        global.db.data.users[m.sender].warn = (global.db.data.users[m.sender].warn || 0) + 1;

        // Delete the offending message
        await conn.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: messageId,
                participant: participant
            }
        });

        let currentWarn = global.db.data.users[m.sender].warn;
        let userData = global.db.data.users[m.sender];

        if (currentWarn < userWarnLimit) {
            // Send warning message with a location and vCard
            let warningContent = {
                key: {
                    participants: '0@s.whatsapp.net',
                    fromMe: false,
                    id: 'Halo'
                },
                message: {
                    locationMessage: {
                        name: "Anti - TikTok ",
                        jpegThumbnail: await (await fetch("https://telegra.ph/file/5dd0169efd3a5c1b99017.png")).buffer(),
                        vcard: vcard
                    }
                },
                participant: '0@s.whatsapp.net'
            };
            conn.reply(m.chat, `⚠ TIKTOK LINKS ARE NOT ALLOWED\n *${userData.warn}* ° WARNING`, warningContent);
        } else {
            // Reset warning count and remove user from group
            global.db.data.users[m.sender].warn = 0;
            m.reply(removeMessage);
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        }
    }

    return true;
}
