import { performance } from 'perf_hooks';
import fetch from 'node-fetch'; // Make sure node-fetch is installed

const handler = async (message, { conn, usedPrefix }) => {
    const userCount = Object.keys(global.db.data.users).length;
    const botName = global.db.data.botname || 'ChatUnity';

    const menuText = generateMenuText(usedPrefix, botName, userCount);
    
    const messageOptions = {
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: `${botName}`
            },
        }
    };

    // Send image with menu
    const imagePath = './terms.jpeg';
    await conn.sendMessage(message.chat, { image: { url: imagePath }, caption: menuText, ...messageOptions }, { quoted: message });
};

async function fetchThumbnail(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    } catch (error) {
        console.error('Error fetching thumbnail:', error);
        return 'default-thumbnail'; // Fallback thumbnail in case of error
    }
}

handler.help = ['FAQ'];
handler.tags = ['info'];
handler.command = /^(apply)$/i;

export default handler;

function generateMenuText(prefix, botName, userCount) {
    return `
🚀 Do you want to join the ChatUnity staff team, gain experience and be recognized as a staff member? 🚀

This is your chance! Fill out the form below (it will remain anonymous) to apply and showcase your skills.

🔥 What awaits you:

• Recognition in the bot as a collaborator
• Hands-on experience in the world of bots and community management
• Exclusive access to Beta Bots
• Direct collaboration with the ChatUnity team

Don't miss this opportunity, apply now and show you have what it takes!

> 📋 Application form:
https://docs.google.com/forms/d/e/1FAIpQLSd4no8yx-QuRf7xFyIcLYHLSNkF2cRaHvsO_prmlIwdKqBC4Q/viewform?usp=dialog
`.trim();
}
