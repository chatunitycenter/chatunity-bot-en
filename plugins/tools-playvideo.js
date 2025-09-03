const search = await yts(text);
if (!search.all || search.all.length === 0) {
  return m.reply('❌ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐯𝐢𝐝𝐞𝐨 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.');
}

const videoInfo = search.all[0];
const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
const infoMessage = `\n*𝑻𝑰𝑻𝑶𝑳𝑶:* ${title}\n*𝑫𝑼𝑹𝑨𝑻𝑨:* ${timestamp}\n*𝑽𝑰𝑬𝑾𝑺:* ${views.toLocaleString()}\n*𝑼𝑺𝑪𝑰𝑻𝑨:* ${ago}\n*𝑳𝑰𝑵𝑲:* ${url} \n> ⏳ 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐝𝐞𝐥 𝐯𝐢𝐝𝐞𝐨 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...`;

const thumb = (await conn.getFile(thumbnail))?.data;

conn.sendMessage(m.chat, {
  text: infoMessage,
  contextInfo: {
    externalAdReply: {
      title: title,
      body: "YouTube Downloader",
      mediaType: 1,
      previewType: 0,
      mediaUrl: url,
      sourceUrl: url,
      thumbnail: thumb,
    }
  }
});

let sources = [
  `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
  `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
  `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
  `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`,
  `https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=720p&apikey=GataDios`,
  `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(url)}`,
  `https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh&url=${url}`
];

const downloadPromises = sources.map(source => downloadFromSource(source, url, title, thumb, m, conn));
const results = await Promise.all(downloadPromises);

if (!results.includes(true)) {
  return m.reply(`⚠︎ *𝐄𝐑𝐑𝐎𝐑𝐄:* 𝐍𝐎𝐍 𝐒𝐎𝐍𝐎 𝐑𝐈𝐔𝐒𝐂𝐈𝐓𝐎 𝐀 𝐓𝐑𝐎𝐕𝐀𝐑𝐄 𝐀𝐋𝐂𝐔𝐍 𝐋𝐈𝐍𝐊 𝐕𝐀𝐋𝐈𝐃𝐎 𝐏𝐄𝐑 𝐈𝐋 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃.`);
}
} catch (error) {
  return m.reply(`⚠︎ *𝐄𝐑𝐑𝐎𝐑𝐄:* ${error.message}`);
}
};

handler.command = ['video'];
handler.tags = ['downloader'];
handler.help = ['playvideo'];

export default handler;
