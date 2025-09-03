import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const handler = async (m, { conn, usedPrefix }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, {
      text: "*🚨 Use this command directly in the bot's number.*"
    }, { quoted: m });
  }

  try {
    const sessionFolder = "./Sessioni/";

    if (!existsSync(sessionFolder)) {
      return await conn.sendMessage(m.chat, {
        text: "*❌ The session folder is empty or does not exist.*"
      }, { quoted: m });
    }

    const sessionFiles = await fsPromises.readdir(sessionFolder);
    let deletedCount = 0;

    for (const file of sessionFiles) {
      if (file !== "creds.json") {
        await fsPromises.unlink(path.join(sessionFolder, file));
        deletedCount++;
      }
    }
 
    await conn.sendMessage(m.chat, { 
      text: deletedCount === 0 
        ? '❗ Sessions are empty, please try again later if you need them ‼️' 
        : '🔥 ' + deletedCount + ' session files have been deleted! Thank you for clearing them out 😼'
    }, { quoted: m });
  } catch (error) {
    await conn.sendMessage(m.chat, { text: "❌ Error during deletion!" }, { quoted: m });
  }
};

export default handler;
