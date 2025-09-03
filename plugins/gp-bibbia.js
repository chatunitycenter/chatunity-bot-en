import axios from 'axios';

const biblePlugin = async (m, { conn, text, usedPrefix, command }) => {
  // If no text, ask GPT for a random verse
  const prompt = text
    ? `Provide the requested Bible verse: "${text}".  
Required output format:

<Book> <Chapter> - <Verse> - <Greek reference in uppercase> (transliteration)

<text of the Bible verse in English>

Respond only with this text, nothing else.`
    : `Provide a random Bible verse in this format:

<Book> <Chapter> - <Verse> - <Greek reference in uppercase> (transliteration)

<text of the Bible verse in English>

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
    console.error('[❌ biblePlugin]', err);
    return conn.reply(m.chat, '⚠️ Error retrieving the verse. Use a valid reference like John 3:16', m);
  }
};

biblePlugin.help = ['bible [reference]'];
biblePlugin.tags = ['faith', 'bible'];
biblePlugin.command = /^bible$/i;

export default biblePlugin;
