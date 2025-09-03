import util from 'util'
import path from 'path'

// Function to get the username part after '@'
let user = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata, command, conn, participants }) {
    // Get list of participant IDs
    let ps = groupMetadata.participants.map(v => v.id)

    // Randomly select 10 participants
    let a = ps.getRandom()
    let b = ps.getRandom()
    let c = ps.getRandom()
    let d = ps.getRandom()
    let e = ps.getRandom()
    let f = ps.getRandom()
    let g = ps.getRandom()
    let h = ps.getRandom()
    let i = ps.getRandom()
    let j = ps.getRandom()

    if (command == 'topgays') {
        // Path to the audio file (currently commented out)
        let vn = './media/gay2.mp3'

        // Construct the top 10 LGBT list
        let top = `*🌈 Top 10 LGBT 🌈*

        *1.- ${user(a)}*
        *2.- ${user(b)}*
        *3.- ${user(c)}*
        *4.- ${user(d)}*
        *5.- ${user(e)}*
        *6.- ${user(f)}*
        *7.- ${user(g)}*
        *8.- ${user(h)}*
        *9.- ${user(i)}*
        *10.- ${user(j)}*`

        // Send message mentioning the top 10 users
        m.reply(top, null, { mentions: [a, b, c, d, e, f, g, h, i, j] })

        // Send audio message (currently commented out)
        conn.sendMessage(m.chat, { quoted: m })    
        //conn.sendFile(m.chat, vn, 'error.mp3', null, m, true, { type: 'audioMessage', ptt: true })
    }
}
