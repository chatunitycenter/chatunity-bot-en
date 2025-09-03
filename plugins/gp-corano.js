import axios from 'axios';

const quranPlugin = async (m, { conn, text, usedPrefix, command }) => {
  const prompt = text
    ? `Report the requested Quran verse: "${text}".  
Required output format:

Surah <chapter>:<verse> - <original Arabic> (<transliteration>)

<verse text in English>

Respond only with this text, nothing else.`
    : `Report a random Quran verse in the following format:

Surah <chapter>:<verse> - <original Arabic> (<transliteration>)

<verse text in English>

Respond only with this text, nothing else.`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat);

    const res = await axios.post('https://luminai.my.id', {
      content: prompt,
      user: m.pushName || "user",
      prompt: 'Always respond in English.',
      webSearchMode: false
    });

    const verse = res.data.result;
    if (!verse) throw new Error("No response received.");

    return await conn.reply(m.chat, verse, m);
  } catch (err) {
    console.error('[❌ quranPlugin]', err);
    return conn.reply(m.chat, '⚠️ Error retrieving the verse. Use a valid reference like 2:255', m);
  }
};

quranPlugin.help = ['quran [reference]'];
quranPlugin.tags = ['religion', 'quran'];
quranPlugin.command = /^quran$/i;

export default quranPlugin;
