import gtts from 'node-gtts';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const defaultLang = 'en'; // Changed to English as default

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let lang = args[0] || defaultLang;
  let text = args.slice(1).join(' ');
  
  // Check if the language code is correct (two letters)
  if (lang.length !== 2) {
    lang = defaultLang;
    text = args.join(' '); // If first arg isn't a language code, treat it as text
  }
  
  // If no text, use quoted text (if available)
  if (!text && m.quoted?.text) text = m.quoted.text;
  
  if (!text) {
    throw `Please enter text to convert to speech!\n\n*Usage:*\n${usedPrefix + command} <language_code> <text>\n${usedPrefix + command} en Hello world\n${usedPrefix + command} es Hola mundo\n${usedPrefix + command} fr Bonjour le monde`;
  }

  let res;
  try {
    res = await tts(text, lang);
  } catch (e) {
    m.reply(`Error with language '${lang}': ${e.message}\nTrying with default language (${defaultLang})...`);
    try {
      res = await tts(text, defaultLang);
    } catch (e2) {
      throw `Failed to generate speech: ${e2.message}`;
    }
  } finally {
    if (res) {
      await conn.sendFile(m.chat, res, 'tts.opus', null, m, true);
    }
  }
};

// Text-to-Speech function
async function tts(text, lang = defaultLang) {
  return new Promise((resolve, reject) => {
    try {
      const tts = gtts(lang);
      const filePath = join(__dirname, '../tmp', `${Date.now()}_tts.wav`);
      
      tts.save(filePath, text, (err) => {
        if (err) {
          reject(new Error(`TTS generation failed: ${err.message}`));
          return;
        }
        
        try {
          const buffer = readFileSync(filePath);
          unlinkSync(filePath); // Clean up temporary file
          resolve(buffer);
        } catch (readErr) {
          reject(new Error(`File read error: ${readErr.message}`));
        }
      });
    } catch (err) {
      reject(new Error(`TTS initialization failed: ${err.message}`));
    }
  });
}

// Handler configuration
handler.help = ['tts', 'texttospeech', 'speak'];
handler.tags = ['tools', 'media'];
handler.command = /^(tts|texttospeech|speak|say)$/i;

export default handler;
