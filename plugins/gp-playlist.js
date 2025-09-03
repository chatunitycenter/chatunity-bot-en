import yts from 'yt-search';  // Motore di ricerca YouTube
import fs from 'fs';          // File system
import path from 'path';      // Gestione dei percorsi file
const BOT_THEME = {
  FRAME: {
    TOP: '╭〔*🎵 GESTORE PLAYLIST*〕┈⊷',
    MIDDLE: '┃◈╭─────────·๏',
    LINE: '┃◈┃•',
    BOTTOM: '┃◈└───────┈⊷\n╰━━━━━━━━━┈·๏',
    SIGNATURE: '꙰ 𝗖𝗿𝗲𝗮𝘇𝗶𝗼𝗻𝗲 𝗚𝗮𝗯𝟯𝟯𝟯 ꙰'
  },
  EMOJIS: {
    ERROR: '⚠️',
    SUCCESS: '✅',
    LOADING: '⌛',
    MUSIC: '🎵',
    VIDEO: '🎬',
    INFO: 'ℹ️',
    PLAYLIST: '📋',
    SAVE: '💾',
    DELETE: '🗑️',
    HEART: '❤️',
    BACK: '🔙'
  }
};
class MusicPlayer {
  static async search(query) {
    const result = await yts(query); // Cerca su YouTube
    return result.all.length ? result.all[0] : null;
  }

  static formatSong(song) {
    return `${BOT_THEME.EMOJIS.MUSIC} *${song.title}*\n` +
           `⏳ ${song.timestamp || 'N/A'} | 📺 ${song.author?.name || 'Sconosciuto'}`;
  }
}
const DB = {
  PATH: path.join('./database', 'Musica.json'),

  init() {
    if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
    if (!fs.existsSync(this.PATH)) fs.writeFileSync(this.PATH, '{}');
  },

  read() {
    try {
      return JSON.parse(fs.readFileSync(this.PATH));
    } catch {
      return {};
    }
  },

  write(data) {
    fs.writeFileSync(this.PATH, JSON.stringify(data, null, 2));
  },

  update(userId, updater) {
    const data = this.read();
    if (!Array.isArray(data[userId])) data[userId] = [];
    updater(data[userId]);
    this.write(data);
  }
};
const handler = async (m, { conn, text, args, command, usedPrefix }) => {
  DB.init();
  const userId = m.sender;
  const isButton = !!m?.key?.id && !text;
  const targetUser = isButton ? userId : (m.quoted?.sender && m.quoted.sender !== userId ? m.quoted.sender : userId);
  const userName = (m.quoted?.sender && m.quoted.sender !== userId) ? (m.quoted.pushName || 'Utente') : null;
  if (command === 'playlist' && (!text || text.trim() === '')) {
    const songs = DB.read()[targetUser] || [];

    if (!songs.length) {
      return m.reply(`${BOT_THEME.EMOJIS.INFO} ${userName ? `${userName} non ha brani salvati` : 'La tua playlist è vuota!'}`);
    }

    let message = `${BOT_THEME.FRAME.TOP}\n` +
                 `${BOT_THEME.FRAME.MIDDLE}\n` +
                 `${BOT_THEME.FRAME.LINE} ${BOT_THEME.EMOJIS.PLAYLIST} ${userName ? `Playlist di ${userName}` : 'La tua playlist'}\n`;

    songs.slice(0, 10).forEach((song, index) => {
      message += `${BOT_THEME.FRAME.LINE} ${index + 1}. ${song.title}\n` +
                `${BOT_THEME.FRAME.LINE} ⏳ ${song.timestamp} | 📺 ${song.channel}\n`;
    });

    if (songs.length > 10) {
      message += `${BOT_THEME.FRAME.LINE} ...e altri ${songs.length - 10} brani\n`;
    }

    message += `${BOT_THEME.FRAME.BOTTOM}\n\n` +
               `${BOT_THEME.EMOJIS.HEART} ${BOT_THEME.FRAME.SIGNATURE}`;

    const buttons = [
      ...songs.slice(0, 5).map((song, i) => (
        { buttonId: `${usedPrefix}play ${song.title}`, buttonText: { displayText: `${i + 1}🎵 ${song.title.slice(0, 20)}` }, type: 1 }
      )),
      { buttonId: `${usedPrefix}salva`, buttonText: { displayText: `${BOT_THEME.EMOJIS.SAVE} Salva nuovo` }, type: 1 }
    ];

    if (!userName) {
      buttons.push(
        { buttonId: `${usedPrefix}elimina`, buttonText: { displayText: `${BOT_THEME.EMOJIS.DELETE} Elimina` }, type: 1 }
      );
    }
    buttons.push(
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: `${BOT_THEME.EMOJIS.BACK} Indietro` }, type: 1 }
    );

    return conn.sendMessage(m.chat, {
      text: message,
      buttons: buttons,
      footer: 'Seleziona un brano da riprodurre',
      viewOnce: true,
      headerType: 4
    }, { quoted: m });
  }
  
