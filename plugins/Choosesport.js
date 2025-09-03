// Fix: Create the rss_sources.json file if it doesn't exist (workaround for errors from other modules that require it)
import fs from 'fs'
const rssPath = './rss_sources.json'
if (!fs.existsSync(rssPath)) {
  fs.writeFileSync(rssPath, JSON.stringify([]))
}

let handler = async (m, { conn }) => {
  global.db.data.users[m.sender] = global.db.data.users[m.sender] || {};

  const sports = [
    { name: '⚽ Football', id: 'calcio' },
    { name: '🏀 Basketball', id: 'basket' },
    { name: '🎾 Tennis', id: 'tennis' },
    { name: '🏎️ Formula 1', id: 'formula1' },
    { name: '🥊 MMA', id: 'mma' },
    { name: '🚴‍♂️ Cycling', id: 'ciclismo' }
  ];

  const buttons = sports.map(sport => ({
    buttonId: `.sportselect ${sport.id}`,
    buttonText: { displayText: sport.name },
    type: 1
  }));

  return await conn.sendMessage(m.chat, {
    text: '📌 *Choose the sport you want to follow to receive personalized news:*',
    footer: '💡 You can change it at any time',
    buttons,
    headerType: 1
  }, { quoted: m });
};

handler.command = /^chooseSport$/i;
handler.help = ['chooseSport'];
handler.tags = ['settings'];
export default handler;
