import fs from 'fs';
import archiver from 'archiver';

let handler = async (m, { text, conn, usedPrefix, command, __dirname }) => {
  if (!text) return m.reply(`⚠️ Use: ${usedPrefix + command} <archive_name>`);

  let archiveName = text.trim();
  let archivePath = `./${archiveName}.zip`;

  await m.reply(`🔄 Creating backup...`);

  const output = fs.createWriteStream(archivePath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', async () => {
    console.log(`Archive created: ${archive.pointer()} bytes`);
    await m.reply(`✅ Backup ${archiveName}.zip created. Sending...`);

    let fileData = fs.readFileSync(archivePath);
    await conn.sendMessage(m.chat, {
      document: fileData,
      mimetype: 'application/zip',
      fileName: `${archiveName}.zip`
    }, { quoted: m });

    fs.unlinkSync(archivePath);
  });

  archive.on('error', (err) => {
    console.error(err);
    m.reply(`❌ Error during compression: ${err.message}`);
  });

  archive.pipe(output);

  
  archive.glob('**/*', {
    ignore: ['node_modules/**', 'Sessioni/**']
  });

  await archive.finalize();
};

handler.command = /^zip$/i;
handler.owner = true;
export default handler;
