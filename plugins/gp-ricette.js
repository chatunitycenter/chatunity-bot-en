import axios from 'axios';

const recipePlugin = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `🍽️ Use it like this:\n${usedPrefix + command} <ingredient/s>\nExample: *${usedPrefix + command} zucchini, potatoes*`, m);
  }

  const ingredients = text.trim();

  const prompt = `
Act as an Italian cooking assistant.
Suggest an **easy but tasty** recipe using these ingredients: ${ingredients}

✦ The format should be clear and organized:
1. Recipe name (creative but realistic)
2. Ingredients (with approximate quantities)
3. Procedure (max 5-6 steps, conversational style)
4. Servings: how many people?
5. Preparation time

✦ The tone should be friendly and simple.
✦ Reply **only in Italian**, and use cooking-related emojis where useful.

Example style:
🍝 *Creamy zucchini pasta*  
🧂 Ingredients: ...  
👨‍🍳 Procedure: ...
`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat);

    const res = await axios.post("https://luminai.my.id", {
      content: prompt,
      user: m.pushName || "user",
      prompt: `Always respond in Italian.`,
      webSearchMode: false
    });

    const response = res.data.result;
    if (!response) throw new Error("Empty response from API.");

    return conn.reply(m.chat, response, m);

  } catch (err) {
    console.error('[❌ recipe plugin error]', err);
    return conn.reply(m.chat, '⚠️ Error generating the recipe. Please try again later!', m);
  }
};

recipePlugin.help = ['recipe <ingredients>'];
recipePlugin.tags = ['cooking', 'ai', 'utility'];
recipePlugin.command = /^ricetta$/i;

export default recipePlugin;ricettaPlugin;
