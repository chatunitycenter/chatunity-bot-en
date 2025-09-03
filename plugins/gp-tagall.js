let handler = async (message, {isOwner: isOwner, isAdmin: isAdmin, conn: connection, text: text, participants: participants, args: arguments, command: command}) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', message, connection);
        throw false;
    }
    
    let messageText = arguments.join` `;
    let headerText = 'TagAll' + messageText;
    let fullMessage = '═══ •⊰✦⊱• ═══ \nBOT: ' + nomebot + '\n\n-_- GROUP MEMBERS -_-\n' + headerText + '\n\n✦➤ ';
    
    for (let participant of participants) {
        fullMessage += '✧‌⃟ᗒ @' + participant.id.split('@')[0] + '\n';
    }
    
    fullMessage += '『💬』 ══ •⊰✰⊱• ══ 『💬』';
    
    let fakeMessage = {
        'key': {
            'participants': '0@s.whatsapp.net',
            'fromMe': false,
            'id': 'Halo'
        },
        'message': {
            'locationMessage': {
                'name': 'TagAll',
                'jpegThumbnail': await (await fetch('https://i.ibb.co/9mWwC5PP/Whats-App-Image-2025-07-06-at-23-32-06.jpg')).buffer(),
                'vcard': `BEGIN:VCARD
VERSION:5.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=15395490858:+1 (539) 549-0858
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`
            }
        },
        'participant': '0@s.whatsapp.net'
    };
    
    connection.sendMessage(message.chat, {
        'text': fullMessage,
        'mentions': participants.map(participant => participant.id)
    }, {
        'quoted': fakeMessage
    });
};

handler.help = ['tagall <message>', 'invoke <message>'];
handler.tags = ['group'];
handler.command = /^(tagall|invoke|mention|everyone|invocation)$/i;
handler.admin = true;
handler.group = true;

export default handler;