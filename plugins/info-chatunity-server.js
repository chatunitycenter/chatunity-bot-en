const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: "🚧 **Features coming soon!*\nYou'll find all the server info here soon. ChatUnity.",
  }, { quoted: m });
};

handler.help = ['server'];
handler.tags = ['info'];
handler.command = /^server$/i;

export default handler;
