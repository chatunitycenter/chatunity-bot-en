let handler = async (m, { conn, participants, args }) => {
    global.db.data.users = global.db.data.users || {}
    let user1 = m.sender
    let mentionedJid = (m.mentionedJid && m.mentionedJid[0]) || ''
    if (!mentionedJid) return m.reply('⚔️ Tag a user to battle!\n\nExample: *.battle @user*')

    let user2 = mentionedJid

    let p1 = global.db.data.users[user1]?.pokemons || []
    let p2 = global.db.data.users[user2]?.pokemons || []

    if (!p1.length) return m.reply('😓 You have no Pokémon to battle!')
    if (!p2.length) return m.reply('😓 Your opponent has no Pokémon to battle!')

    let poke1 = pickRandom(p1)
    let poke2 = pickRandom(p2)

    let power1 = poke1.level + randBetween(-10, 10)
    let power2 = poke2.level + randBetween(-10, 10)

    let winner, loser, resultText

    if (power1 > power2) {
        winner = user1
        loser = user2
        resultText = `🏆 @${user1.split('@')[0]} wins the battle!`
    } else if (power2 > power1) {
        winner = user2
        loser = user1
        resultText = `🏆 @${user2.split('@')[0]} wins the battle!`
    } else {
        resultText = `🤝 Draw! Both Pokémon are exhausted.`
    }

    let battleText = `
⚔️ *Pokémon Battle!*

👤 @${user1.split('@')[0]} chose *${poke1.name}* (Lv. ${poke1.level})
👤 @${user2.split('@')[0]} chose *${poke2.name}* (Lv. ${poke2.level})

${resultText}
`.trim()

    await conn.sendMessage(m.chat, { text: battleText, mentions: [user1, user2] }, { quoted: m })
}

handler.help = ['battle @user']
handler.tags = ['pokemon']
handler.command = /^battle$/i

export default handler

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
