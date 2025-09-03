let handler = async (m, { conn, participants, groupMetadata, args }) => {
    const chat = m.chat;
    
    // Get group profile picture or use default image
    const profilePicture = await conn.profilePictureUrl(chat, 'image').catch(error => null) || './src/error.jpg';
    
    // Get all participant IDs
    const participantIds = participants.map(participant => participant.id);
    
    // Format participant list with numbers
    const formattedList = participantIds.map((id, index) => 
        `✦ ${(index + 1)}. @${id.split('@')[0]}`
    ).join('\n');
    
    // Get group owner or use first participant
    const owner = groupMetadata.owner || 
                 participants.find(participant => participant.id === 'owner')?.id || 
                 chat.split`-`[0] + '@s.whatsapp.net';

    let text = args.join` `;
    let captionText = text ? text + '\n' : '';
    let finalCaption = ('\n══════ •⊰✦⊱• ══════\n' + 
                       formattedList + 
                       '\n══════ •⊰✦⊱• ══════\n').trim();

    // Send message with group picture and participant list
    conn.sendFile(
        chat,
        profilePicture,
        'image.jpg',
        finalCaption,
        m,
        false,
        {
            'mentions': [...participants.map(participant => participant.id), owner]
        }
    );
};

handler.help = ['admins <text>'];
handler.tags = ['group'];
handler.command = /^(admin|@admins|dmins)$/i;
handler.group = true;

export default handler;
