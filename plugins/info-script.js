import moment from 'moment-timezone';
import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  let response = await fetch('https://api.github.com/repos/chatunitycenter/chatunity-bot-en');
  let repoData = await response.json();

  let messageText = `『💬』 ══ •⊰✰⊱• ══ 『💬』\n`;
  messageText += `✧ Name: ${repoData.name}\n`;
  messageText += `✧ Link: ${repoData.html_url}\n`;
  messageText += `✦ Size: ${(repoData.size / 1024).toFixed(2)} MB\n`;
  messageText += `✧ Updated: ${moment(repoData.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
  messageText += `✧ Watchers: ${repoData.watchers_count}\n`;
  messageText += `『💬』 ══ •⊰✰⊱• ══ 『💬』\n`;
  messageText += `✧ Forks: ${repoData.forks_count} · Stars: ${repoData.stargazers_count} · Issues: ${repoData.open_issues_count}\n`;
  messageText += `『💬』 ══ •⊰✰⊱• ══ 『💬』\n`;

  const messageOptions = {
    mentions: [], // You can add mentions if needed
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363259442839354@newsletter',
        serverMessageId: '',
        newsletterName: 'ChatUnity'
      }
    }
  };

  try {
    await conn.sendMessage(m.chat, { text: messageText, ...messageOptions });
  } catch (error) {
    console.error('Error while sending the message:', error);
    m.reply('Error while executing the command.');
  }
};

handler.help = ['info'];
handler.tags = ['info'];
handler.command = /^script$/i;

export default handler;