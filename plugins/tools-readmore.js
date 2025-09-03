let handler = async (m, { conn, text }) => {
    // Divide il testo in due parti separate dal carattere "|"
    let [l, r] = text.split`|`;
    if (!l) l = '';  // Se la parte sinistra è vuota, la imposta a stringa vuota
    if (!r) r = '';  // Se la parte destra è vuota, la imposta a stringa vuota
    
    // Risponde nel chat concatenando la prima parte, 
    // un grande blocco invisibile (readMore) e poi la seconda parte
    conn.reply(m.chat, l + readMore + r, m);
}

// Informazioni di aiuto per il comando
handler.help = ['readmore <testo1>|<testo2>'];
handler.tags = ['tools'];
handler.command = ['leermas', 'readmore']; // Comandi per attivare questa funzione
export default handler;

// Carattere speciale usato per creare un "leggi di più" invisibile
const more = String.fromCharCode(8206);
// Ripete questo carattere 4001 volte per creare uno spazio nascosto molto grande
const readMore = more.repeat(4001);
