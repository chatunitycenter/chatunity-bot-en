let handler = m => m;

handler.all = async function (m, { isBotAdmin }) {
    const chat = global.db.data.chats[m.chat];
    if (!chat.antivirus) return; // Exit if antivirus is disabled for this chat

    // If the message type is 68 (usually a deleted or suspicious message)
    if (m.messageStubType === 68) {
        let log = {
            key: m.key,
            content: m.msg,
            sender: m.sender
        };
        // Clear the chat (excluding starred messages)
        await this.modifyChat(m.chat, 'clear', {
            includeStarred: false
        }).catch(console.log);
    }
};

export default handler;
