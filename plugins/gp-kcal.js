import axios from 'axios';

const kcalPlugin = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `﹒⋆❛ ${usedPrefix + command} <food item>\n❥ Please specify a food item to analyze!\nExample: *${usedPrefix + command} strawberry*`,
      m
    );
  }

  const foodItem = text.trim();

  const prompt = `
Generate a stylish, readable, and informative **nutrition facts sheet** for the following food: *${foodItem}*.

The format must be **exactly** like this (only change values, not the style):

★·.·´¯\`·.·★ ⟡ ˚｡⋆『 ˗ˏˋ  ${foodItem.toUpperCase()}  ˎˊ˗ 』⋆｡˚⟡ ★·.·´¯\`·.·★

📌 *Analyzed portion:* *100g*
🧭 *Nutritional rating:* *(High, Moderate, Low)*
🔍 *Data source:* *AI Nutrition Engine*

╭─❍ 『 🔥 』 *ENERGY*
│• *XXX kcal* (X% DV)
│🔹 Caloric density: *(high / moderate / low)*
╰───────────────

╭─❍ 『 🥩 』 *MACRONUTRIENTS*
│• *Protein:* Xg (X% DV)
│• *Fat:* Xg (X% DV)
│  ↳ _Saturated:_ Xg (X% DV)
│• *Carbohydrates:* Xg (X% DV)
│  ↳ _Sugars:_ Xg
│• *Fiber:* Xg (X% DV)
╰───────────────

╭─❍ 『 🧪 』 *MICRONUTRIENTS*
│• *Sodium:* Xmg
│• *Potassium:* Xmg
│• *Calcium:* Xmg
│• *Iron:* Xmg
│• *Cholesterol:* Xmg
╰───────────────

╭─❍ 『 ℹ️ 』 *GENERAL INFO*
│• Category: *(e.g. Fruit, Vegetable, Legume)*
│• Recommended portion: XXg
│• Caloric density: XXX kcal/100g
╰───────────────

╭─❍ 『 💡 』 *NUTRITIONAL ADVICE*
│✓ *(e.g. Great for snacking / Should be balanced with proteins, etc.)*
╰───────────────

╭─❍ 『 📝 』 *PROFESSIONAL NOTE*
│Write a short note (max 4 lines) with a medical-nutritional tone.
╰───────────────

⋆ ˚｡✦ *DV = Daily Values based on a 2000 kcal diet*
⋆ ˚｡✦ *Consult a registered dietitian for personalized guidance*
`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat);

    const res = await axios.post("https://luminai.my.id", {
      content: prompt,
      user: m.pushName || "user",
      prompt: `Always respond in English.`,
      webSearchMode: false
    });

    const response = res.data.result;
    if (!response) throw new Error("Empty response from the API.");

    return await conn.reply(m.chat, response, m);

  } catch (err) {
    console.error('[❌ kcal plugin error]', err);
    return await conn.reply(m.chat, '⚠️ Error while processing the nutritional sheet. Please try again later.', m);
  }
};

kcalPlugin.help = ['kcal <food>'];
kcalPlugin.tags = ['nutrition', 'ai'];
kcalPlugin.command = /^kcal$/i;

export default kcalPlugin;
