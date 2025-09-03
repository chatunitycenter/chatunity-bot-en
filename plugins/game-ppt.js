let cooldowns = {}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let points = 300
    let cooldownTime = 2 * 60 * 1000 // 2 minutes
    let user = global.db.data.users[m.sender]
 
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < cooldownTime) {
        let remainingTime = secondsToHMS(Math.ceil((cooldowns[m.sender] + cooldownTime - Date.now()) / 1000))
        return conn.reply(m.chat, `[ ✰ ] You already played recently, wait *⏱ ${remainingTime}* to play again.`, m)
    }

    cooldowns[m.sender] = Date.now()

    if (!text) return conn.reply(m.chat, '[ ✰ ] Choose an option ( *rock/paper/scissors* ) to start the game.\n\n`» Example:`\n' + `> *${usedPrefix + command}* rock`, m)

    let options = ['rock', 'paper', 'scissors']
    let botChoice = options[Math.floor(Math.random() * options.length)]

    if (!options.includes(text)) return conn.sendMessage(m.chat, { 
        text: '[ ✰ ] Choose a valid option ( *rock/paper/scissors* ) to start the game.\n\n`» Example:`\n' + `> *${usedPrefix + command}* rock`,
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

    let result = ''
    let pointsEarned = 0

    if (text === botChoice) {
        result = `[ ✿ ]︎ Draw!! You receive *100 💶 Unitycoins* as reward`
        pointsEarned = 100
    } else if (
        (text === 'rock' && botChoice === 'scissors') ||
        (text === 'scissors' && botChoice === 'paper') ||
        (text === 'paper' && botChoice === 'rock')
    ) {
        result = `[ ✰ ]︎ YOU WON!! You earned *300 💶 Unitycoins*`
        pointsEarned = points
    } else {
        result = `[ ✿︎ ] YOU LOST!! You lost *300 💶 Unitycoins*`
        pointsEarned = -points
    }

    user.limit += pointsEarned
    await conn.sendMessage(m.chat, { 
        text: `${result}\n\nMy choice: *${botChoice.toUpperCase()}*`,
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

handler.help = ['rps']
handler.tags = ['game']
handler.command = ['rps', 'rockpaperscissors']

function secondsToHMS(seconds) {
    return `${seconds % 60} seconds`
}

export default handler
