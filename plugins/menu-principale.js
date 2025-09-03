import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn, usedPrefix, command }) => {
    const userCount = Object.keys(global.db.data.users).length;
    const botName = global.db.data.botname || 'ChatUnity';

    const menuText = generateMenuText(usedPrefix, botName, userCount);

    const imagePath = path.join(__dirname, '../menu/main.jpeg'); 
    await conn.sendMessage(
        message.chat,
        {
            image: { url: imagePath },
            caption: menuText,
            footer: 'Choose a menu:',
            buttons: [
                { buttonId: `${usedPrefix}adminmenu`, buttonText: { displayText: "🛡️ Admin Menu" }, type: 1 },
                { buttonId: `${usedPrefix}ownermenu`, buttonText: { displayText: "👑 Owner Menu" }, type: 1 },
                { buttonId: `${usedPrefix}securitymenu`, buttonText: { displayText: "🚨 Security Menu" }, type: 1 },
                { buttonId: `${usedPrefix}groupmenu`, buttonText: { displayText: "👥 Group Menu" }, type: 1 },
                { buttonId: `${usedPrefix}aimenu`, buttonText: { displayText: "🤖 AI Menu" }, type: 1 }
            ],
            viewOnce: true,
            headerType: 4
        }
    );
};

handler.help = ['menu'];
handler.tags = ['menu'];
handler.command = /^(menu|commands)$/i;

export default handler;

function generateMenuText(prefix, botName, userCount) {
    return `

╭〔 *💬 BOT MENU 💬* 〕┈⊷
┃◈╭───────────·๏
┃◈┃• 👑 *${prefix}staff*
┃◈┃• 👑 *${prefix}hegemony*
┃◈┃• 📜 *${prefix}apply*
┃◈┃• 📥 *${prefix}install*
┃◈┃• 📖 *${prefix}guide*
┃◈┃• 📝 *${prefix}channels* 
┃◈┃• ⚙  *${prefix}system*
┃◈┃• ❓ *${prefix}FAQ*
┃◈┃• 🚀 *${prefix}ping*
┃◈┃• 📝 *${prefix}report* (command)
┃◈┃• 💡 *${prefix}suggest* (command)
┃◈┃• 🆕 *${prefix}news* (updates)
┃◈┃
┃◈└───────────┈⊷
┃◈┃• *VERSION:* ${vs}
┃◈┃•  COLLAB: ONE PIECE
┃◈┃•  USERS: ${userCount}
╰━━━━━━━━━━━━━┈·๏
`.trim();
}