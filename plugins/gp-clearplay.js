import fs from "fs";
import path from "path";

const PLAY_FOLDER = "./play"; // 📂 MP3 Folder

let handler = async (m, { conn, isAdmin, isOwner }) => {
    if (!isAdmin && !isOwner) {
        return conn.sendMessage(m.chat, { text: "❌ *Only admins can use this command!*" }, { quoted: m });
    }

    if (!fs.existsSync(PLAY_FOLDER)) {
        return conn.sendMessage(m.chat, { text: "✅ *The folder is already empty!*" }, { quoted: m });
    }

    let files = fs.readdirSync(PLAY_FOLDER);
    if (files.length === 0) {
        return conn.sendMessage(m.chat, { text: "✅ *No files to delete!*" }, { quoted: m });
    }

    // 🗑️ Delete all MP3 files
    for (let file of files) {
        let filePath = path.join(PLAY_FOLDER, file);
        fs.unlinkSync(filePath);
    }

    await conn.sendMessage(m.chat, { 
        text: "🗑️ *Play folder cleared successfully!*", 
        react: { text: "✅", key: m.key } 
    }, { quoted: m });
};

handler.command = /^(clearplay)$/i;
handler.group = true;
handler.admin = true;

export default handler;
