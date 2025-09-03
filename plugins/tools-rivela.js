let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));

let handler = async (m, { conn }) => {
    // Controlla se il messaggio a cui si risponde esiste
    if (!m.quoted) throw '𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨¹';
    // Controlla che il messaggio citato sia un'immagine o video "view once"
    if (m.quoted.mtype !== 'viewOnceMessageV2') throw '𝐍𝐨𝐧 𝐦𝐢 𝐬𝐞𝐦𝐛𝐫𝐚 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨¹';

    let msg = m.quoted.message;
    let type = Object.keys(msg)[0];  // Prende il tipo del messaggio (es. imageMessage o videoMessage)

    // Scarica il contenuto multimediale (immagine o video)
    let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video');

    let buffer = Buffer.from([]);
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk]); // Ricostruisce il file multimediale dal flusso
    }

    // Se è un video, invia come file mp4
    if (/video/.test(type)) {
        return conn.sendFile(m.chat, buffer, 'media.mp4', msg[type].caption || '', m);
    } 
    // Se è un'immagine, invia come file jpg
    else if (/image/.test(type)) {
        return conn.sendFile(m.chat, buffer, 'media.jpg', msg[type].caption || '', m);
    }
}

handler.help = ['readvo'];
handler.tags = ['tools'];
handler.command = ['readviewonce', 'nocap', 'rivela', 'readvo'];

export default handler;
