import axios from 'axios';

const animalInfoPlugin = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `﹒⋆❛ ${usedPrefix + command} <animal name>\n❥ Please specify an animal you'd like information about!\nExample: *${usedPrefix + command} fennec*`,
      m
    );
  }

  const animal = text.trim();

  const prompt = `
Create an informative and aesthetically formatted profile for the animal "*${animal}*".

❥ The tone should be educational yet light. Use subtle decorative symbols.
❥ Always reply in **English**.
❥ The format must be **exactly** like this (only replace the factual content, not the style):

★·.·´¯\`·.·★ ⟡ ˚｡⋆『 ˗ˏˋ  ${animal.toUpperCase()}  ˎˊ˗ 』⋆｡˚⟡ ★·.·´¯\`·.·★

🦊 *Common Name:* ${animal}
📚 *Scientific Name:* (e.g. Vulpes vulpes)
🌍 *Habitat:* (e.g. Temperate forests, deserts, savannas...)
🍽️ *Diet:* (herbivore, omnivore, carnivore – include examples)
📏 *Size:* (average length/weight)
🧠 *Behavior:* (e.g. solitary, social, nocturnal, etc.)
🎨 *Features:* (e.g. fur, beak, claws, teeth...)

╭─❍ 『 💫 』 *FUN FACTS*
│• Add 2-3 short and interesting fun facts
╰───────────────
𖦹﹒✧･ﾟﾟ･:*:･ﾟ✧﹒𖦹
`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat);

    const res = await axios.post("https://luminai.my.id", {
      content: prompt,
      user: m.pushName || "user",
      prompt: `Always reply in English.`,
      webSearchMode: false
    });

    const replyText = res.data.result;
    if (!replyText) throw new Error("Empty response from the API.");

    return await conn.reply(m.chat, replyText, m);

  } catch (err) {
    console.error('[❌ animalInfo plugin error]', err);
    return await conn.reply(m.chat, '⚠️ Error while generating the animal profile. Please try again later.', m);
  }
};

animalInfoPlugin.help = ['animalinfo <animal>'];
animalInfoPlugin.tags = ['animals', 'ai', 'education'];
animalInfoPlugin.command = /^animalinfo$/i;

export default animalInfoPlugin;
