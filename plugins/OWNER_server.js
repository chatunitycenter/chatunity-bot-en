import { exec } from 'child_process';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  let cmd = text.trim();
  if (!cmd) {
    return m.reply("⚠️ You must specify the command to execute. Example: `.server ls -la`");
  }

  await m.reply(`🔄 Executing command: "${cmd}"`);

  exec(cmd, { timeout: 30000 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return m.reply(`❌ Error during execution: ${error.message}`);
    }
    
    let output = '';
    if (stdout) output += `📤 Output:\n${stdout}`;
    if (stderr) output += `⚠️ Errors/Warnings:\n${stderr}`;
    
    if (!output) output = "✅ Command executed with no output";
    
    if (output.length > 4000) {
      output = output.substring(0, 4000) + "\n... (output truncated)";
    }
    
    m.reply(output);
  });
};

handler.command = /^(server|cmd|exec)$/i;
handler.owner = true;
export default handler;
