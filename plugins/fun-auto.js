let handler = async (m, { conn, isAdmin }) => {
  const text = m.text?.toLowerCase();

  if (text === '.skiplogo') {
    if (!m.isGroup) return m.reply('⚠ This command only works in groups!');
    if (!global.logoGame?.[m.chat]) return m.reply('⚠ No active game!');
    if (!isAdmin && !m.fromMe) return m.reply('❌ Only admins can skip!');
    clearTimeout(global.logoGame[m.chat].timeout);
    await conn.reply(m.chat, `🛑 Game stopped. The answer was: *${global.logoGame[m.chat].answer}*`, m);
    delete global.logoGame[m.chat];
    return;
  }

  if (text === '.auto') {
    if (global.logoGame?.[m.chat]) return m.reply('⚠ Game already in progress!');
    global.cooldowns = global.cooldowns || {};
    const now = Date.now(), key = `logo_${m.chat}`;
    if (now - (global.cooldowns[key] || 0) < 10000) {
      return m.reply(`⏳ Wait ${Math.ceil((10000 - (now - global.cooldowns[key]))/1000)}s before trying again.`);
    }
    global.cooldowns[key] = now;

    const logos = [
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/audi.png', brand: 'audi' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/bmw.png', brand: 'bmw' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mercedes-benz.png', brand: 'mercedes-benz' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/porsche.png', brand: 'porsche' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/volkswagen.png', brand: 'volkswagen' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/opel.png', brand: 'opel' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/ford.png', brand: 'ford' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/smart.png', brand: 'smart' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/maybach.png', brand: 'maybach' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/fiat.png', brand: 'fiat' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/ferrari.png', brand: 'ferrari' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/lamborghini.png', brand: 'lamborghini' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/maserati.png', brand: 'maserati' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/alfa-romeo.png', brand: 'alfa-romeo' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/lancia.png', brand: 'lancia' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/pagani.png', brand: 'pagani' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/de-tomaso.png', brand: 'de-tomaso' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/bugatti.png', brand: 'bugatti' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/tesla.png', brand: 'tesla' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/honda.png', brand: 'honda' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/toyota.png', brand: 'toyota' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/nissan.png', brand: 'nissan' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mazda.png', brand: 'mazda' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/chevrolet.png', brand: 'chevrolet' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/volvo.png', brand: 'volvo' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/jeep.png', brand: 'jeep' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/mini.png', brand: 'mini' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/kia.png', brand: 'kia' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/hyundai.png', brand: 'hyundai' },
      { url: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/land-rover.png', brand: 'land-rover' },
    ];

    const choice = logos[Math.floor(Math.random() * logos.length)];
    const phrases = ['🚘 GUESS THE LOGO!', '🏁 What brand is this?', '🔍 Recognize this car?'];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    global.logoGame = global.logoGame || {};
    global.logoGame[m.chat] = {
      answer: choice.brand,
      startTime: Date.now(),
      timeout: setTimeout(() => {
        if (global.logoGame?.[m.chat]) {
          conn.reply(m.chat, `⏰ Time's up! Answer: *${choice.brand}*`, m);
          delete global.logoGame[m.chat];
        }
      }, 60000)
    };

    await conn.sendMessage(m.chat, { image: { url: choice.url }, caption: `${phrase}\n⌛ 60 seconds.` }, { quoted: m });
  }
};

handler.before = async (m, { conn }) => {
  const game = global.logoGame?.[m.chat];
  if (!game || m.key.fromMe) return;
  const text = m.text?.toLowerCase().trim();
  if (!text) return;
  if (text === game.answer) {
    clearTimeout(game.timeout);
    const reward = 100;
    const exp = 10;
    const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
    const timeBonus = 0;
    const congratsMessage = `
╭━『 🎉 CORRECT ANSWER! 』━╮
┃
┃ 🚗 Brand: ${game.answer}
┃ ⏱ Time taken: ${timeTaken}s
┃
┃ 🎁 Rewards:
┃ • ${reward} 💰 UC${timeBonus > 0 ? ` (+${timeBonus} speed bonus)` : ''}
┃ • ${exp} 🆙 EXP
┃
╰━━━━━━━━━━━━━━━━╯

> \\by chatunity\\`;

    await conn.reply(m.chat, congratsMessage, m);
    delete global.logoGame[m.chat];
  }
};

handler.help = ['auto', 'skiplogo'];
handler.tags = ['game'];
handler.command = ['auto', 'skiplogo'];
export default handler;
