let cooldowns = {};

const rcanal = "valore_predefinito"; // Sostituisci "valore_predefinito" con il valore appropriato

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let punti = 300;
    let tempoAttesa = 5 * 1000; // 5 secondi
    let utente = global.db.data.users[m.sender];

    // Controllo del cooldown
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoAttesa) {
        let tempoRimanente = secondiInMinutiSecondi(Math.ceil((cooldowns[m.sender] + tempoAttesa - Date.now()) / 1000));
        return conn.reply(
            m.chat,
            `[ ✰ ] Hai già iniziato una partita di recente, aspetta *⏱ ${tempoRimanente}* per giocare di nuovo.`,
            m,
            rcanal
        );
    }

    cooldowns[m.sender] = Date.now();

    // Se non è stato fornito un testo/opzione
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `[ ✰ ] Scegli un'opzione per iniziare il gioco:`,
            buttons: [
                { buttonId: `${usedPrefix + command} rock`, buttonText: { displayText: "🪨 Sasso" }, type: 1 },
                { buttonId: `${usedPrefix + command} paper`, buttonText: { displayText: "📄 Carta" }, type: 1 },
                { buttonId: `${usedPrefix + command} scissors`, buttonText: { displayText: "✂️ Forbici" }, type: 1 }
            ]
        }, { quoted: m });
    }

    let opzioni = ['rock', 'paper', 'scissors'];
    let sceltaBot = opzioni[Math.floor(Math.random() * opzioni.length)];

    if (!opzioni.includes(text)) {
        return conn.sendMessage(m.chat, {
            text: `[ ✰ ] Scegli un'opzione valida (rock/paper/scissors) per iniziare il gioco:`,
            buttons: [
                { buttonId: `${usedPrefix + command} rock`, buttonText: { displayText: "🪨 Sasso" }, type: 1 },
                { buttonId: `${usedPrefix + command} paper`, buttonText: { displayText: "📄 Carta" }, type: 1 },
                { buttonId: `${usedPrefix + command} scissors`, buttonText: { displayText: "✂️ Forbici" }, type: 1 }
            ]
        }, { quoted: m });
    }

    let risultato = '';
    let puntiGuadagnati = 0;

    if (text === sceltaBot) {
        risultato = `[ ✿ ] È un pareggio!! Ricevi *100 🪙 UnityCoins* come premio.`;
        puntiGuadagnati = 100;
    } else if (
        (text === 'rock' && sceltaBot === 'scissors') ||
        (text === 'scissors' && sceltaBot === 'paper') ||
        (text === 'paper' && sceltaBot === 'rock')
    ) {
        risultato = `[ ✰ ] HAI VINTO!! Hai guadagnato *300 🪙 UnityCoins*.`;
        puntiGuadagnati = punti;
    } else {
        risultato = `[ ✿ ] HAI PERSO!! Hai perso *300 🪙 UnityCoins*.`;
        puntiGuadagnati = -punti;
    }

    utente.limit += puntiGuadagnati;

    conn.sendMessage(m.chat, {
        text: risultato,
        buttons: [
            { buttonId: `${usedPrefix + command}`, buttonText: { displayText: "🔄 Riprova" }, type: 1 }
        ]
    }, { quoted: m });
};

handler.help = ['rps'];
handler.tags = ['game'];
handler.command = ['rps', 'rockpaperscissors'];
//handler.group = true
handler.register = true;

export default handler;

// Funzione per convertire secondi in formato minuti e secondi
function secondiInMinutiSecondi(secondi) {
    let minuti = Math.floor(secondi / 60);
    let secondiRestanti = secondi % 60;
    return `${minuti}m ${secondiRestanti}s`;
}
