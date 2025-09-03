import fs from 'fs';
import path from 'path';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  let fileName = text.trim();
  if (!fileName) {
    return m.reply("⚠️ You must specify the name of the file to create. Example: `.file name.txt`");
  }
  
  let filePath = path.join(process.cwd(), fileName);
  
  if (fs.existsSync(filePath)) {
    return m.reply(`⚠️ The file "${fileName}" already exists.`);
  }
  
  fs.writeFile(filePath, '', (err) => {
    if (err) {
      console.error(`Error creating the file: ${err.message}`);
      return m.reply(`❌ Error creating the file: ${err.message}`);
    }
    m.reply(`✅ The file "${fileName}" was created successfully in the bot's folder.`);
  });
};

handler.command = /^file$/i;
handler.owner = true;
export default handler;
