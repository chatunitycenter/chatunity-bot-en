import axios from 'axios';

const langMap = {
  "🇿🇦 Afrikaans": "af",
  "🇦🇱 Albanian": "sq",
  "🇸🇦 Arabic": "ar",
  "🇦🇲 Armenian": "hy",
  "🇦🇿 Azerbaijani": "az",
  "🇪🇸 Basque": "eu",
  "🇧🇾 Belarusian": "be",
  "🇧🇩 Bengali": "bn",
  "🇧🇬 Bulgarian": "bg",
  "🇪🇸 Catalan": "ca",
  "🇨🇿 Czech": "cs",
  "🇩🇰 Danish": "da",
  "🇳🇱 Dutch": "nl",
  "🇬🇧 English": "en",
  "🌍 Esperanto": "eo",
  "🇪🇪 Estonian": "et",
  "🇵🇭 Filipino": "tl",
  "🇫🇮 Finnish": "fi",
  "🇫🇷 French": "fr",
  "🇪🇸 Galician": "gl",
  "🇬🇪 Georgian": "ka",
  "🇩🇪 German": "de",
  "🇬🇷 Greek": "el",
  "🇮🇳 Gujarati": "gu",
  "🇭🇹 Haitian": "ht",
  "🇮🇱 Hebrew": "he",
  "🇮🇳 Hindi": "hi",
  "🇭🇺 Hungarian": "hu",
  "🇮🇸 Icelandic": "is",
  "🇮🇩 Indonesian": "id",
  "🇮🇪 Irish": "ga",
  "🇮🇹 Italian": "it",
  "🇯🇵 Japanese": "ja",
  "🇮🇳 Kannada": "kn",
  "🇰🇷 Korean": "ko",
  "🇻🇦 Latin": "la",
  "🇱🇻 Latvian": "lv",
  "🇱🇹 Lithuanian": "lt",
  "🇲🇰 Macedonian": "mk",
  "🇮🇳 Malayalam": "ml",
  "🇲🇾 Malay": "ms",
  "🇲🇹 Maltese": "mt",
  "🇳🇴 Norwegian": "no",
  "🇮🇷 Persian": "fa",
  "🇵🇱 Polish": "pl",
  "🇵🇹 Portuguese": "pt",
  "🇷🇴 Romanian": "ro",
  "🇷🇺 Russian": "ru",
  "🇷🇸 Serbian": "sr",
  "🇸🇰 Slovak": "sk",
  "🇸🇮 Slovenian": "sl",
  "🇪🇸 Spanish": "es",
  "🇸🇪 Swedish": "sv",
  "🇰🇪 Swahili": "sw",
  "🇮🇳 Tamil": "ta",
  "🇮🇳 Telugu": "te",
  "🇹🇭 Thai": "th",
  "🇹🇷 Turkish": "tr",
  "🇺🇦 Ukrainian": "uk",
  "🇵🇰 Urdu": "ur",
  "🇻🇳 Vietnamese": "vi",
  "🇳🇬 Yoruba": "yo",
  "🇿🇦 Zulu": "zu"
};

let handler = async (m, { conn, args }) => {
  if (!args.length) {
    let tutorial = `*🌍 Translate Command Usage 🌍*\n`;
    tutorial += `📌 Format: *.translate <text> <language>*\n📖 Example: *.translate hello japanese*\n\n`;
    tutorial += `🌐 *Supported Languages:* 🌐\n\n`;

    for (const [name, code] of Object.entries(langMap)) {
      tutorial += `🔹 ${name} = \`${code}\`\n`;
    }

    return conn.reply(m.chat, tutorial, m);
  }

  if (args.length < 2) {
    return conn.reply(m.chat, `⚠️ Correct usage: *.translate <text> <language>*\n📖 Example: *.translate hello chinese*`, m);
  }

  const text = args.slice(0, -1).join(" ");
  const langInput = args[args.length - 1].toLowerCase();
  const targetLang = Object.values(langMap).includes(langInput) ? langInput : langMap[Object.keys(langMap).find(k => k.toLowerCase().includes(langInput))];

  if (!targetLang) {
    return conn.reply(m.chat, `❌ Language not recognized. Use *.translate* to see the list of available languages.`, m);
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const { data } = await axios.get(url);
    const translatedText = data[0]?.[0]?.[0] || "No translation found.";

    return conn.reply(
      m.chat,
      `🌍 *Translation:* 🌍\n📌 *Original text:* ${text}\n📖 *Target language:* ${langInput} (${targetLang})\n\n🔹 *Result:* ${translatedText}`,
      m
    );
  } catch (error) {
    console.error("Translation error:", error);
    return conn.reply(m.chat, `❌ Translation error. Check the parameters and try again.`, m);
  }
};

handler.help = ['translate <text> <language>'];
handler.tags = ['tools'];
handler.command = /^translate$/i;

export default handler;
