let handler = async (m, { conn }) => {
  const message = `
🌑 *DARKNESS PACKS* 🌑

*Darkness* packs cannot be purchased, but they **seemingly appear out of nowhere** when you open *Premium* packs.

➡️ For every 10 *Premium* packs opened, you have a 50% chance to get a bonus *Darkness* pack.

🎲 Opening a *Darkness* pack gives you a 10% chance to find special Darkness Pokémon.

Use *.open darkness* to open Darkness packs.

Good luck! 🍀
`;

  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['darknessinfo'];
handler.tags = ['pokemon'];
handler.command = /^darknessinfo$/i;

export default handler;
