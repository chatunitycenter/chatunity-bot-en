let handler = async (m, { conn }) => {
    try {
        // Main message without buttons
        await conn.sendMessage(m.chat, {
            text: `🎮 *FREE & SAFE MINECRAFT GAME!* 🎮\n\n` +
                  `Discover *Eaglercraft*, the browser version of Minecraft you can play ANYWHERE!\n\n` +
                  `🔗 *Direct Link:* https://eaglercraft.com/\n` +
                  `✅ 100% Free\n` +
                  `🔒 Safe and no download needed\n` +
                  `🌐 Play directly from your browser\n\n` +
                  `Click the link above to start playing!`,
            footer: '© BixByBot - Have fun!',
            mentions: [m.sender]
        }, { quoted: m });

        // Send an image message after 1 second
        setTimeout(async () => {
            await conn.sendMessage(m.chat, {
                image: { 
                    url: 'https://i.imgur.com/JlxJmZQ.png'
                },
                caption: 'Here’s what Eaglercraft looks like! 👆',
                mentions: [m.sender]
            }, { quoted: m });
        }, 1000);

    } catch (error) {
        console.error('Error:', error);
        await conn.sendMessage(m.chat, { 
            text: '❌ Error displaying the link. Please try again later.'
        }, { quoted: m });
    }
}

handler.help = ['minecraft'];
handler.tags = ['games'];
handler.command = ['minecraft', 'mc', 'eaglercraft'];
handler.premium = false;

export default handler;
