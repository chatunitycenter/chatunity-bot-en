const botsInfo = {
  "333bot": "🤖 *333bot*\nHistoric Italian bot created by Gab 333, famous for modularity, group management, and over 100 active plugins.",
  "bixby-bot": "🤖 *Bixby-Bot*\nInnovative and versatile, specialized in automations and smart responses.",
  "origin-bot": "🤖 *Origin-Bot*\nFeature-rich in security and automations, unmatched speed.",
  "universal-bot": "🤖 *Universal-Bot*\nMulti-purpose bot, supports many platforms and integrations.",
  "turbo-bot": "🤖 *Turbo-Bot*\nOptimized for performance and managing large groups.",
  "onix-bot": "🤖 *Onix-Bot*\nEvery response, a touch of class. Elegance stands out.",
  "varebot": "🤖 *VareBot*\nVersatile bot with rich APIs, offering useful features and fun commands in a simple and fast experience!"
};

const handler = async (m, { conn, args, usedPrefix }) => {
  if (args && args[0] && botsInfo[args[0].toLowerCase()]) {
    await conn.sendMessage(
      m.chat,
      {
        text: botsInfo[args[0].toLowerCase()],
        footer: 'Go back with .egemonia',
        buttons: [
          { buttonId: `${usedPrefix}egemonia`, buttonText: { displayText: "🔙 Back to Egemonia" }, type: 1 }
        ],
        viewOnce: true,
        headerType: 4
      },
      { quoted: m }
    );
    return;
  }

  const text = `
╭━〔*🌐 EGEMONIA PROJECT*〕━┈⊷
*Egemonia* is a project created by the ChatUnity founder to bring together the greatest private bot developers:

┃◈ • 333bot
┃◈ • Bixby-Bot
┃◈ • Origin-Bot
┃◈ • Universal-Bot
┃◈ • Turbo-Bot
┃◈ • Onix-Bot
┃◈ • VareBot

Together to make chatunity-bot-en globally competitive, helping with plugin creation and fixes.
From version 5.0, plugins created by these developers are already included!
╰━━━━━━━━━━━━━━⊷

*Learn more about each bot by clicking the buttons below!*
`.trim();

  await conn.sendMessage(
    m.chat,
    {
      text,
      footer: 'Powered by ChatUnity Egemonia',
      buttons: [
        { buttonId: `${usedPrefix}egemonia 333bot`, buttonText: { displayText: "🤖 333bot" }, type: 1 },
        { buttonId: `${usedPrefix}egemonia bixby-bot`, buttonText: { displayText: "🤖 Bixby-Bot" }, type: 1 },
        { buttonId: `${usedPrefix}egemonia origin-bot`, buttonText: { displayText: "🤖 Origin-Bot" }, type: 1 },
        { buttonId: `${usedPrefix}egemonia universal-bot`, buttonText: { displayText: "🤖 Universal-Bot" }, type: 1 },
        { buttonId: `${usedPrefix}egemonia turbo-bot`, buttonText: { displayText: "🤖 Turbo-Bot" }, type: 1 },
        { buttonId: `${usedPrefix}egemonia onix-bot`, buttonText: { displayText: "🤖 Onix-Bot" }, type: 1 },
        { buttonId: `${usedPrefix}egemonia varebot`, buttonText: { displayText: "🤖 VareBot" }, type: 1 }
      ],
      viewOnce: true,
      headerType: 4
    },
    { quoted: m }
  );
};

handler.help = ['egemonia'];
handler.tags = ['info'];
handler.command = /^egemonia(?:\s(\S+))?$/i;

export default handler;