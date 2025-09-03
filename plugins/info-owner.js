let handler = async (m, { conn }) => {
    const createVCard = (name, number, role) => {
        return `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:ChatUnity;
TEL;type=CELL;type=VOICE;waid=${number}:+${number}
X-ABLabel:${role}
END:VCARD`.replace(/\n/g, '\r\n');
    };

    await conn.sendMessage(m.chat, { 
        contacts: { 
            displayName: 'Creator Bot', 
            contacts: [
                { vcard: createVCard('Creatore', '393515533859', 'Founder') }
            ]
        }
    }, { quoted: m });
};

handler.help = ['creator'];
handler.tags = ['info'];
handler.command = ['creator', 'founder', 'owner']; // ✅ Qui la correzione
export default handler;