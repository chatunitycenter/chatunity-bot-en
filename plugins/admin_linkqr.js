//Plugin made by Gabs & 333 Staff
import QRCode from 'qrcode';

const handler = async (m, { conn }) => {
    try {
        const inviteLink = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat);
        const qrImageBuffer = await QRCode.toBuffer(inviteLink);
        await conn.sendMessage(m.chat, { image: qrImageBuffer, caption: 'Here is the QR Code for the group link!' });
    } catch (error) {
        m.reply('Error generating QR Code: ' + error.message);
    }
};

handler.help = ['linkgroup'];
handler.tags = ['group'];
handler.command = /^linkqr(gro?up)?$/i;
handler.group = true;
handler.botAdmin = true;

export default handler;
