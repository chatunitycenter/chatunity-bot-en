const handler = async (m, { conn, args }) => {
    const metadata = await conn.groupMetadata(m.chat);
    const groupName = metadata.subject;

    const interactiveButtons = [
        {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "Copy",
                id: 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat),
                copy_code: 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat)
            })
        },
        {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: "Reset",
                id: `/resetgroup ${m.chat}`,
            })
        }
    ];

    const interactiveMessage = {
        text: `*${groupName}*`,
        title: "Here is the group link:",
        footer: "Choose one of the following options:",
        interactiveButtons
    };

    await conn.sendMessage(m.chat, interactiveMessage, { quoted: m });
};

handler.help = ['linkgroup'];
handler.tags = ['group'];
handler.command = /^link$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;
