function handler(m, { text }) {
    // Check if text is provided, if not send error message
    if (!text) return conn.sendMessage(m.chat, { 
        text: `🚩 Please enter your name after the command.`,
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: 'ChatUnity'
            }
        }
    }, { quoted: m });

    // Get text from input, quoted message, or original message
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text;
    
    // Convert each letter to ninja syllables
    let ninjaName = teks.replace(/[a-z]/gi, v => {
        return {
            'a': 'ka',      // a becomes ka
            'b': 'tsu',     // b becomes tsu
            'c': 'mi',      // c becomes mi
            'd': 'te',      // d becomes te
            'e': 'ku',      // e becomes ku
            'f': 'hi',      // f becomes hi
            'g': 'ji',      // g becomes ji
            'h': 'ri',      // h becomes ri
            'i': 'ki',      // i becomes ki
            'j': 'zu',      // j becomes zu
            'k': 'me',      // k becomes me
            'l': 'ta',      // l becomes ta
            'm': 'rin',     // m becomes rin
            'n': 'to',      // n becomes to
            'o': 'mo',      // o becomes mo
            'p': 'no',      // p becomes no
            'q': 'ke',      // q becomes ke
            'r': 'shi',     // r becomes shi
            's': 'ari',     // s becomes ari
            't': 'chi',     // t becomes chi
            'u': 'do',      // u becomes do
            'v': 'ru',      // v becomes ru
            'w': 'mei',     // w becomes mei
            'x': 'na',      // x becomes na
            'y': 'fu',      // y becomes fu
            'z': 'mori'     // z becomes mori
        }[v.toLowerCase()] || v;  // Keep original character if not a letter
    });

    // Send the converted ninja name back to chat
    conn.sendMessage(m.chat, { 
        text: ninjaName,
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: 'ChatUnity'
            }
        }
    }, { quoted: m });
}

// Command configuration
handler.help = ['ninjaname *<text>*'];           // Help text showing usage
handler.tags = ['fun'];                          // Category: fun commands
handler.command = ['ninjaname'];                 // Command trigger
handler.register = true;                         // Requires user registration

export default handler;
