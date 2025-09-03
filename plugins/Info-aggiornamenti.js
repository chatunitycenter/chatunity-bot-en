import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn }) => {
    const newsText = `*RELEASE V6.1*\n\n`
                  + `📅 *Date:* 18/08\n`
                  + `🆕 *Main updates:*\n`
                  + `• New social command\n`
                  + `• Optimized console logs\n`
                  + `• Optimized update\n`
                  + `• New dox interface\n`
                  + `• New staff members: giusemd & anubi\n`
                  + `• *Security management transferred to DEATH:*\n`
                  + `  - New security features\n`
                  + `  - Complete project restructuring\n`
                  + `• Preparation for V7.0 with new features\n\n`;

    await conn.sendMessage(
        message.chat,
        { text: newsText },
        { quoted: message }
    );
};

handler.help = ['news'];
handler.tags = ['info'];
handler.command = /^(news|updates)$/i;

export default handler;
